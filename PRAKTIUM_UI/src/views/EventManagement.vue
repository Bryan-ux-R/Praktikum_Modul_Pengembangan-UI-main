<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'

const {
  activeEvents,
  completedEvents,
  categories,
  storageError,
  loading,
  error: apiError,
  fetchEvents,
  createEvent: createEventRequest,
  completeEvent,
  deleteEvent,
  formatEventDate,
} = useEvents()

const currentTab = ref('active')
const errorMessage = ref('')
const successMessage = ref('')
const eventToDelete = ref(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const form = reactive({
  title: '',
  category: '',
  date: '',
  location: '',
  description: '',
})

const visibleEvents = computed(() =>
  currentTab.value === 'completed' ? completedEvents.value : activeEvents.value,
)

const loadEvents = async () => {
  try {
    await fetchEvents()
  } catch {
    // The composable exposes the request error in the management page.
  }
}

onMounted(loadEvents)

watch(
  form,
  () => {
    errorMessage.value = ''
  },
  { deep: true },
)

const resetFeedback = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const selectTab = (tab) => {
  currentTab.value = tab
  resetFeedback()
}

const createEvent = async () => {
  if (isSubmitting.value) {
    return
  }

  resetFeedback()

  const missingField = Object.values(form).some((value) => !value.trim())

  if (missingField) {
    errorMessage.value = 'Please complete every field before publishing the event.'
    return
  }

  if (Number.isNaN(new Date(form.date).getTime())) {
    errorMessage.value = 'Please enter a valid event date and time.'
    return
  }

  isSubmitting.value = true

  try {
    const event = await createEventRequest(form)
    Object.assign(form, {
      title: '',
      category: '',
      date: '',
      location: '',
      description: '',
    })
    currentTab.value = 'active'
    successMessage.value = `"${event.title}" was added to active events.`
  } catch (requestError) {
    errorMessage.value =
      requestError instanceof Error ? requestError.message : 'The event could not be published.'
  } finally {
    isSubmitting.value = false
  }
}

const markComplete = (event) => {
  resetFeedback()

  if (!completeEvent(event.id)) {
    errorMessage.value = 'This event could not be marked as completed. Refresh and try again.'
    return
  }

  successMessage.value = `"${event.title}" was moved to completed events.`
}

const confirmDelete = async () => {
  if (!eventToDelete.value || isDeleting.value) {
    return
  }

  const { id, title } = eventToDelete.value
  resetFeedback()
  isDeleting.value = true

  try {
    if (!(await deleteEvent(id))) {
      throw new Error('This event could not be found in the current event list.')
    }

    eventToDelete.value = null
    successMessage.value = `"${title}" was deleted.`
  } catch (requestError) {
    errorMessage.value =
      requestError instanceof Error ? requestError.message : 'The event could not be deleted.'
    eventToDelete.value = null
  } finally {
    isDeleting.value = false
  }
}

const requestEventDelete = (event) => {
  resetFeedback()
  eventToDelete.value = event
}
</script>

<template>
  <section class="management-page">
    <header class="management-header">
      <div>
        <span class="management-eyebrow">EVENT WORKSPACE</span>
        <h2>Manage your events</h2>
        <p>Create events, keep their status up to date, and review completed events.</p>
      </div>
    </header>

    <p v-if="storageError" class="feedback-message feedback-error" role="alert">
      {{ storageError }}
    </p>
    <div
      v-if="apiError && !errorMessage"
      class="feedback-message feedback-error management-api-error"
      role="alert"
    >
      <span>{{ apiError }}</span>
      <AppButton variant="secondary" :loading="loading" @click="loadEvents">Try again</AppButton>
    </div>
    <p v-if="errorMessage" class="feedback-message feedback-error" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="feedback-message feedback-success" role="status">
      {{ successMessage }}
    </p>

    <div class="management-tabs" role="tablist" aria-label="Manage event status">
      <button
        id="active-tab"
        type="button"
        role="tab"
        :aria-selected="currentTab === 'active'"
        aria-controls="event-panel"
        :class="{ selected: currentTab === 'active' }"
        @click="selectTab('active')"
      >
        Active Events <span>{{ activeEvents.length }}</span>
      </button>
      <button
        id="create-tab"
        type="button"
        role="tab"
        :aria-selected="currentTab === 'create'"
        aria-controls="event-panel"
        :class="{ selected: currentTab === 'create' }"
        @click="selectTab('create')"
      >
        Create Event
      </button>
      <button
        id="completed-tab"
        type="button"
        role="tab"
        :aria-selected="currentTab === 'completed'"
        aria-controls="event-panel"
        :class="{ selected: currentTab === 'completed' }"
        @click="selectTab('completed')"
      >
        Completed Events <span>{{ completedEvents.length }}</span>
      </button>
    </div>

    <section
      id="event-panel"
      class="tab-panel"
      role="tabpanel"
      :aria-labelledby="`${currentTab}-tab`"
    >
      <form v-if="currentTab === 'create'" class="event-form" @submit.prevent="createEvent">
        <div class="form-heading">
          <span class="management-eyebrow">NEW LISTING</span>
          <h3>Publish an event</h3>
          <p>Fill in the details below. All fields are required.</p>
        </div>

        <div class="form-grid">
          <label class="form-field">
            <span>Event name</span>
            <input
              v-model="form.title"
              type="text"
              maxlength="100"
              placeholder="e.g. Community Meetup"
            />
          </label>
          <label class="form-field">
            <span>Category</span>
            <input
              v-model="form.category"
              type="text"
              maxlength="60"
              list="event-categories"
              placeholder="e.g. Technology"
            />
            <datalist id="event-categories">
              <option v-for="category in categories" :key="category" :value="category" />
            </datalist>
          </label>
          <label class="form-field">
            <span>Date and time</span>
            <input v-model="form.date" type="datetime-local" />
          </label>
          <label class="form-field">
            <span>Location</span>
            <input
              v-model="form.location"
              type="text"
              maxlength="120"
              placeholder="Venue and city"
            />
          </label>
          <label class="form-field form-field-wide">
            <span>Description</span>
            <textarea
              v-model="form.description"
              rows="4"
              maxlength="500"
              placeholder="Tell people what to expect from this event."
            ></textarea>
          </label>
        </div>

        <div class="form-actions">
          <AppButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
            Publish Event
          </AppButton>
        </div>
      </form>

      <div v-else-if="visibleEvents.length" class="managed-event-list">
        <AppCard
          v-for="event in visibleEvents"
          :key="event.id"
          tag="article"
          class="managed-event-card"
          :class="{ completed: event.done }"
        >
          <div class="managed-event-main">
            <div class="managed-event-meta">
              <span class="status-badge" :class="{ 'status-completed': event.done }">
                {{ event.done ? 'Completed' : 'Active' }}
              </span>
              <span class="event-category">{{ event.category }}</span>
            </div>
            <h3>{{ event.title }}</h3>
            <p class="managed-event-details">
              {{ formatEventDate(event.date) }} · {{ event.location }}
            </p>
            <p class="managed-event-description">{{ event.description }}</p>
          </div>
          <div class="managed-event-actions">
            <AppButton v-if="!event.done" variant="secondary" @click="markComplete(event)">
              Mark Complete
            </AppButton>
            <AppButton
              variant="secondary"
              class="delete-button"
              :disabled="isDeleting"
              @click="requestEventDelete(event)"
            >
              Delete
            </AppButton>
          </div>
        </AppCard>
      </div>

      <AppCard v-else tag="section" class="management-empty">
        <span class="empty-mark" aria-hidden="true">◇</span>
        <h3>
          {{ currentTab === 'completed' ? 'No completed events yet' : 'No active events yet' }}
        </h3>
        <p>
          {{
            currentTab === 'completed'
              ? 'Events you mark as complete will be kept here.'
              : 'Create your first event to start building your community calendar.'
          }}
        </p>
        <AppButton v-if="currentTab === 'active'" @click="currentTab = 'create'">
          Create Event
        </AppButton>
      </AppCard>
    </section>

    <AppModal
      v-if="eventToDelete"
      title="Delete this event?"
      :message="`“${eventToDelete.title}” will be permanently removed from your event list.`"
      confirm-label="Delete event"
      :confirm-disabled="isDeleting"
      @confirm="confirmDelete"
      @close="eventToDelete = null"
    />
  </section>
</template>

<style scoped>
.management-page {
  display: grid;
  gap: var(--space-6);
  max-width: 1100px;
}

.management-header h2,
.form-heading h3 {
  margin: var(--space-2) 0;
  color: var(--text-main);
  font-size: 1.55rem;
  font-weight: 800;
  letter-spacing: -0.035em;
}

.management-header p,
.form-heading p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.management-eyebrow {
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.feedback-message {
  margin: 0;
  padding: 12px 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 0.92rem;
  line-height: 1.5;
}

.feedback-error {
  color: #a12533;
  background: #fff3f4;
  border-color: #f1c8cc;
}

.feedback-success {
  color: #24633d;
  background: #f0faf3;
  border-color: #ccebd5;
}

.management-api-error {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.management-tabs {
  display: flex;
  gap: 6px;
  padding: 5px;
  overflow-x: auto;
  background: #f0eff5;
  border-radius: 12px;
}

.management-tabs button {
  display: inline-flex;
  min-height: 42px;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  color: #666573;
  background: transparent;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
}

.management-tabs button.selected {
  color: var(--primary);
  background: #fff;
  box-shadow: 0 2px 6px rgba(28, 25, 72, 0.08);
}

.management-tabs button span {
  display: grid;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  place-items: center;
  background: #f0edff;
  border-radius: 999px;
  font-size: 0.75rem;
}

.tab-panel {
  min-width: 0;
}

.managed-event-list {
  display: grid;
  gap: var(--space-4);
}

.managed-event-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-5, 20px);
}

.managed-event-card.completed {
  background: #fbfbfd;
}

.managed-event-main {
  min-width: 0;
}

.managed-event-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.status-badge {
  padding: 4px 9px;
  color: #5636da;
  background: #f0edff;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-completed {
  color: #24633d;
  background: #e9f7ed;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
}

.managed-event-card h3 {
  margin: 0 0 6px;
  color: var(--text-main);
  font-size: 1.08rem;
  font-weight: 750;
}

.managed-event-details,
.managed-event-description {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.managed-event-description {
  margin-top: 8px;
}

.managed-event-actions {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 8px;
}

.delete-button {
  color: #a12533;
}

.delete-button:hover {
  color: #a12533;
  border-color: #d98b93;
}

.management-empty {
  padding: clamp(30px, 6vw, 52px) 24px;
  text-align: center;
}

.empty-mark {
  display: inline-grid;
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  place-items: center;
  color: var(--primary);
  background: #f0edff;
  border-radius: 14px;
  font-size: 1.5rem;
}

.management-empty h3 {
  margin: 0 0 8px;
  color: var(--text-main);
}

.management-empty p {
  margin: 0 0 18px;
  color: var(--text-muted);
  line-height: 1.6;
}

.event-form {
  padding: clamp(20px, 4vw, 32px);
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.form-heading {
  margin-bottom: 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-field {
  display: grid;
  min-width: 0;
  gap: 7px;
  color: var(--text-main);
  font-size: 0.88rem;
  font-weight: 650;
}

.form-field-wide {
  grid-column: 1 / -1;
}

.form-field input,
.form-field textarea {
  width: 100%;
  min-width: 0;
  padding: 11px 12px;
  color: var(--text-main);
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  font: inherit;
  font-weight: 400;
}

.form-field textarea {
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  border-color: var(--primary);
  outline: 3px solid rgba(102, 68, 255, 0.12);
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: #92919c;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 650px) {
  .managed-event-card {
    flex-direction: column;
  }

  .managed-event-actions {
    width: 100%;
  }

  .managed-event-actions :deep(button) {
    flex: 1;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field-wide {
    grid-column: auto;
  }
}
</style>
