<script setup>
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useEvents } from '@/composables/useEvents'

const { events, userRegistrations, cancelRegistration, formatEventDate } = useEvents()

const registrationToCancel = ref(null)
const cancellationError = ref('')

const tickets = computed(() =>
  userRegistrations.value
    .map((registration) => ({
      ...registration,
      event: events.value.find((event) => String(event.id) === String(registration.eventId)),
    }))
    .filter((ticket) => ticket.event),
)

const confirmCancellation = () => {
  const registration = registrationToCancel.value
  registrationToCancel.value = null

  if (registration && !cancelRegistration(registration.id)) {
    cancellationError.value =
      'The registration could not be canceled. Refresh the page and try again.'
    return
  }

  cancellationError.value = ''
}
</script>

<template>
  <section class="your-events-page">
    <header class="page-header">
      <span class="page-eyebrow">YOUR GATHERLY WALLET</span>
      <h1>Your Events</h1>
      <p>Find your registrations and open a ticket whenever you need it.</p>
    </header>

    <p v-if="cancellationError" class="cancellation-error" role="alert">
      {{ cancellationError }}
    </p>

    <div v-if="tickets.length" class="ticket-grid">
      <AppCard v-for="ticket in tickets" :key="ticket.id" tag="article" class="ticket-card">
        <div class="ticket-top">
          <span class="event-category">{{ ticket.event.category }}</span>
          <span class="ticket-status" :class="{ concluded: ticket.event.done }">
            {{ ticket.event.done ? 'Concluded' : 'Upcoming' }}
          </span>
        </div>
        <h2>{{ ticket.event.title }}</h2>
        <dl class="ticket-event-details">
          <div>
            <dt>Date</dt>
            <dd>{{ formatEventDate(ticket.event.date) }}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{{ ticket.event.location }}</dd>
          </div>
        </dl>
        <div class="ticket-reference">
          <span>Ticket reference</span>
          <strong>{{ ticket.id }}</strong>
        </div>
        <div class="ticket-actions">
          <router-link
            :to="{ name: 'ticket-receipt', params: { ticketId: ticket.id } }"
            class="ticket-link"
          >
            View ticket details <span aria-hidden="true">→</span>
          </router-link>
          <AppButton
            v-if="!ticket.event.done"
            variant="secondary"
            class="cancel-ticket-button"
            @click="registrationToCancel = ticket"
          >
            Cancel registration
          </AppButton>
          <span v-else class="archive-label">Archived event</span>
        </div>
      </AppCard>
    </div>

    <AppCard v-else class="empty-state">
      <span class="empty-icon" aria-hidden="true">◇</span>
      <h2>No tickets yet</h2>
      <p>When you register for an event, your tickets will be saved here.</p>
      <router-link to="/browse/events" class="browse-link">Explore events</router-link>
    </AppCard>

    <AppModal
      v-if="registrationToCancel"
      title="Cancel this registration?"
      :message="`Your ticket for “${registrationToCancel.event.title}” will be canceled and the seat released.`"
      confirm-label="Cancel registration"
      @confirm="confirmCancellation"
      @close="registrationToCancel = null"
    />
  </section>
</template>

<style scoped>
.your-events-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4) 0 var(--space-12);
}

.page-header {
  margin-bottom: var(--space-8);
}

.page-eyebrow {
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.page-header h1 {
  margin: 7px 0;
  color: var(--text-main);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.page-header p {
  margin: 0;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.cancellation-error {
  margin: 0 0 var(--space-4);
  padding: 12px 16px;
  color: #a12533;
  background: #fff3f4;
  border: 1px solid #f1c8cc;
  border-radius: 10px;
  line-height: 1.5;
}

.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr));
  align-items: stretch;
  gap: var(--space-6);
}

.ticket-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
}

.ticket-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ticket-status {
  padding: 5px 10px;
  color: #24633d;
  background: #e9f7ed;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
}

.ticket-status.concluded {
  color: #666573;
  background: #f0eff5;
}

.ticket-card h2 {
  margin: 0;
  color: var(--text-main);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.ticket-event-details {
  display: grid;
  gap: 12px;
  margin: 0;
}

.ticket-event-details > div {
  display: grid;
  gap: 3px;
}

.ticket-event-details dt,
.ticket-reference span {
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 600;
}

.ticket-event-details dd {
  margin: 0;
  color: var(--text-main);
  font-size: 0.9rem;
  line-height: 1.5;
}

.ticket-reference {
  display: grid;
  gap: 5px;
  padding: 12px;
  background: #f7f5ff;
  border: 1px dashed #c9c0ff;
  border-radius: 9px;
}

.ticket-reference strong {
  color: var(--text-main);
  overflow-wrap: anywhere;
  font-size: 0.86rem;
  letter-spacing: 0.03em;
}

.ticket-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
}

.ticket-link,
.browse-link {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

.ticket-link:hover,
.browse-link:hover {
  text-decoration: underline;
}

.cancel-ticket-button {
  min-height: 36px;
  padding: 0.45rem 0.75rem;
  color: #a12533;
  font-size: 0.78rem;
}

.cancel-ticket-button:hover {
  color: #a12533;
  border-color: #d98b93;
}

.archive-label {
  color: var(--text-muted);
  font-size: 0.78rem;
}

.empty-state {
  max-width: 680px;
  margin: 0 auto;
  padding: clamp(28px, 6vw, 56px) 24px;
  text-align: center;
}

.empty-icon {
  display: inline-grid;
  width: 52px;
  height: 52px;
  margin-bottom: var(--space-3);
  place-items: center;
  color: var(--primary);
  background: #f0edff;
  border-radius: 16px;
  font-size: 2rem;
}

.empty-state h2 {
  margin: 0 0 var(--space-2);
  color: var(--text-main);
  font-size: 1.35rem;
}

.empty-state p {
  margin: 0 0 var(--space-6);
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
