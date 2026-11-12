<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import RegistrationForm from '@/components/event/RegistrationForm.vue'
import RegistrationReceipt from '@/components/event/RegistrationReceipt.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useEvents } from '@/composables/useEvents'

const route = useRoute()
const router = useRouter()
const { events, registerAttendee, isUserRegistered, getRegistrationForEvent, formatEventDate } =
  useEvents()

const event = computed(() =>
  events.value.find((item) => String(item.id) === String(route.params.eventId)),
)
const registration = ref(null)
const submissionError = ref('')
const existingRegistration = computed(() =>
  event.value ? getRegistrationForEvent(event.value.id) : undefined,
)
const registrationClosed = computed(
  () =>
    !registration.value &&
    (!event.value ||
      event.value.done ||
      isUserRegistered(event.value.id) ||
      event.value.remainingSeats <= 0),
)

const submitRegistration = (attendee) => {
  submissionError.value = ''
  const result = registerAttendee(route.params.eventId, attendee)

  if (result.error) {
    submissionError.value = result.error
    return
  }

  registration.value = result.registration
}

const openTicket = () => {
  if (!registration.value) {
    return
  }

  router.push({ name: 'ticket-receipt', params: { ticketId: registration.value.id } })
}

const returnToEvent = () => {
  router.push({ name: 'event-detail', params: { id: route.params.eventId } })
}
</script>

<template>
  <section class="registration-page">
    <router-link :to="`/browse/events/${route.params.eventId}`" class="back-link">
      ← Back to event details
    </router-link>

    <header class="registration-page-header">
      <span class="page-eyebrow">YOUR NEXT EXPERIENCE</span>
      <h1>Event registration</h1>
      <p>Review the event and add your details to reserve your seat.</p>
    </header>

    <div v-if="!event" class="unavailable-state">
      <AppCard>
        <h2>Event not found</h2>
        <p>This event is no longer available for registration.</p>
        <AppButton @click="router.push({ name: 'events' })">Browse events</AppButton>
      </AppCard>
    </div>
    <div v-else-if="registrationClosed" class="unavailable-state">
      <AppCard>
        <h2>
          {{
            event.done
              ? 'Registration is closed'
              : existingRegistration
                ? 'You are already registered'
                : 'This event is sold out'
          }}
        </h2>
        <p>
          {{
            existingRegistration
              ? 'Your ticket is ready in Your Events.'
              : 'Please return to the event list to explore other available events.'
          }}
        </p>
        <AppButton
          v-if="existingRegistration"
          @click="
            router.push({
              name: 'ticket-receipt',
              params: { ticketId: existingRegistration.id },
            })
          "
        >
          View your ticket
        </AppButton>
        <AppButton v-else @click="router.push({ name: 'events' })">Browse events</AppButton>
      </AppCard>
    </div>
    <div v-else class="registration-layout">
      <AppCard class="event-summary">
        <span class="summary-label">YOU'RE REGISTERING FOR</span>
        <span class="summary-category">{{ event.category }}</span>
        <h2>{{ event.title }}</h2>
        <dl>
          <div>
            <dt>Date</dt>
            <dd>{{ formatEventDate(event.date) }}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{{ event.location }}</dd>
          </div>
          <div>
            <dt>Seats remaining</dt>
            <dd>{{ event.remainingSeats }}</dd>
          </div>
        </dl>
        <p class="summary-description">{{ event.description }}</p>
      </AppCard>

      <div class="form-column">
        <p v-if="submissionError" class="submission-error" role="alert">
          {{ submissionError }}
        </p>
        <RegistrationForm :event="event" @submit="submitRegistration" @cancel="returnToEvent" />
      </div>
    </div>

    <AppModal
      v-if="registration"
      title="Registration confirmed!"
      dialog-role="dialog"
      icon-variant="success"
    >
      <p class="confirmation-intro">
        Your seat for <strong>{{ registration.eventTitle }}</strong> is confirmed. Your ticket is
        saved in Your Events.
      </p>
      <RegistrationReceipt :registration="registration" />
      <template #footer>
        <AppButton variant="secondary" @click="router.push({ name: 'events' })">
          Back to events
        </AppButton>
        <AppButton @click="openTicket">View ticket</AppButton>
      </template>
    </AppModal>
  </section>
</template>

<style scoped>
.registration-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4) 0 var(--space-12);
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary);
}

.registration-page-header {
  margin-bottom: var(--space-8);
}

.page-eyebrow,
.summary-label {
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.registration-page-header h1 {
  margin: 7px 0;
  color: var(--text-main);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.registration-page-header p {
  margin: 0;
  color: var(--text-muted);
  font-size: 1.02rem;
  line-height: 1.6;
}

.registration-layout {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.5fr);
  align-items: start;
  gap: var(--space-6);
}

.event-summary {
  position: sticky;
  top: 100px;
  padding: clamp(20px, 3vw, 28px);
  background: linear-gradient(145deg, #fff 0%, #fbfaff 100%);
  border-color: #eeebff;
}

.summary-category {
  display: inline-block;
  margin-top: 20px;
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.event-summary h2 {
  margin: 7px 0 20px;
  color: var(--text-main);
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.035em;
}

.event-summary dl {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 18px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.event-summary dl > div {
  display: grid;
  gap: 3px;
}

.event-summary dt {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
}

.event-summary dd {
  margin: 0;
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
}

.summary-description {
  margin: 16px 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

.form-column {
  min-width: 0;
}

.submission-error {
  margin: 0 0 var(--space-4);
  padding: 12px 16px;
  color: #a12533;
  background: #fff3f4;
  border: 1px solid #f1c8cc;
  border-radius: 10px;
  line-height: 1.5;
}

.unavailable-state {
  max-width: 680px;
  margin: var(--space-12) auto;
  text-align: center;
}

.unavailable-state h2 {
  margin: 0 0 8px;
  color: var(--text-main);
}

.unavailable-state p {
  margin: 0 0 20px;
  color: var(--text-muted);
  line-height: 1.6;
}

.confirmation-intro {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.confirmation-intro strong {
  color: var(--text-main);
}

.modal-actions :deep(button) {
  white-space: nowrap;
}

@media (max-width: 800px) {
  .registration-layout {
    grid-template-columns: 1fr;
  }

  .event-summary {
    position: static;
  }
}

@media (max-width: 480px) {
  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions :deep(button) {
    width: 100%;
  }
}
</style>
