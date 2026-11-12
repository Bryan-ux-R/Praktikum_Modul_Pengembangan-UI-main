<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'

const route = useRoute()
const {
  events,
  getRegistrationById,
  isEventDone,
  formatEventDate,
  fetchEvents,
  loading,
  error: apiError,
} = useEvents()

const loadEvents = async () => {
  try {
    await fetchEvents()
  } catch {
    // The ticket snapshot remains available if the event API is offline.
  }
}

onMounted(loadEvents)

const registration = computed(() => getRegistrationById(String(route.params.ticketId)))
const event = computed(() =>
  registration.value
    ? events.value.find((item) => String(item.id) === String(registration.value.eventId))
    : undefined,
)
const concluded = computed(() =>
  Boolean(registration.value && isEventDone(registration.value.eventId)),
)
const printTicket = () => window.print()
</script>

<template>
  <section v-if="registration" class="receipt-page">
    <div v-if="apiError" class="ticket-api-warning" role="alert">
      <span>{{ apiError }} The ticket saved in this browser is still available.</span>
      <AppButton variant="secondary" :loading="loading" @click="loadEvents">Try again</AppButton>
    </div>

    <div class="receipt-heading">
      <span class="success-mark" aria-hidden="true">✓</span>
      <span class="page-eyebrow">YOUR TICKET</span>
      <h1>Registration confirmed</h1>
      <p>Keep this ticket reference handy when you attend the event.</p>
    </div>

    <AppCard class="digital-ticket">
      <div class="ticket-banner">
        <div>
          <span class="ticket-label">GATHERLY EVENT PASS</span>
          <h2>{{ event?.title || registration.eventTitle }}</h2>
        </div>
        <span class="ticket-status" :class="{ concluded }">
          {{ concluded ? 'Concluded' : 'Upcoming' }}
        </span>
      </div>

      <div class="reference-block">
        <span>Ticket reference</span>
        <strong>{{ registration.id }}</strong>
      </div>

      <div class="receipt-grid">
        <section>
          <span class="detail-label">ATTENDEE</span>
          <strong>{{ registration.name }}</strong>
        </section>
        <section>
          <span class="detail-label">EMAIL</span>
          <strong>{{ registration.email }}</strong>
        </section>
        <section>
          <span class="detail-label">PHONE</span>
          <strong>{{ registration.phone }}</strong>
        </section>
        <section>
          <span class="detail-label">DATE OF BIRTH</span>
          <strong>{{ registration.dateOfBirth }}</strong>
        </section>
        <section>
          <span class="detail-label">EVENT DATE</span>
          <strong>{{ formatEventDate(event?.date || registration.eventDate) }}</strong>
        </section>
        <section>
          <span class="detail-label">LOCATION</span>
          <strong>{{ event?.location || registration.eventLocation }}</strong>
        </section>
        <section class="reason-block">
          <span class="detail-label">WHY I'M ATTENDING</span>
          <p>{{ registration.reason }}</p>
        </section>
      </div>

      <footer class="ticket-footer">
        <p>This digital ticket is saved in this browser and can be reopened from Your Events.</p>
        <AppButton variant="secondary" @click="printTicket">Print ticket</AppButton>
      </footer>
    </AppCard>

    <div class="receipt-actions">
      <router-link to="/your-events">← Back to Your Events</router-link>
      <router-link to="/browse/events">Explore more events</router-link>
    </div>
  </section>

  <AppCard v-else class="receipt-not-found">
    <span class="empty-mark" aria-hidden="true">⌕</span>
    <h1>Ticket not found</h1>
    <p>This ticket may have been canceled or is unavailable in this browser.</p>
    <AppButton @click="$router.push('/your-events')">Go to Your Events</AppButton>
  </AppCard>
</template>

<style scoped>
.receipt-page {
  max-width: 920px;
  margin: 0 auto;
  padding: var(--space-8) 0 var(--space-12);
}

.ticket-api-warning {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: 12px 16px;
  color: #a12533;
  background: #fff3f4;
  border: 1px solid #f1c8cc;
  border-radius: 10px;
  line-height: 1.5;
}

.receipt-heading {
  margin-bottom: var(--space-6);
  text-align: center;
}

.success-mark,
.empty-mark {
  display: grid;
  width: 50px;
  height: 50px;
  margin: 0 auto 12px;
  place-items: center;
  color: #24633d;
  background: #e9f7ed;
  border-radius: 50%;
  font-size: 1.4rem;
  font-weight: 800;
}

.page-eyebrow {
  color: var(--primary);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.receipt-heading h1 {
  margin: 6px 0;
  color: var(--text-main);
  font-size: clamp(1.8rem, 4vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.receipt-heading p,
.receipt-not-found p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.digital-ticket {
  padding: clamp(20px, 5vw, 42px);
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(28, 25, 72, 0.07);
}

.ticket-banner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.ticket-label,
.detail-label {
  color: var(--primary);
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.09em;
}

.ticket-banner h2 {
  margin: 8px 0 0;
  color: var(--text-main);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.ticket-status {
  flex: 0 0 auto;
  padding: 6px 11px;
  color: #24633d;
  background: #e9f7ed;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.ticket-status.concluded {
  color: #666573;
  background: #f0eff5;
}

.reference-block {
  display: grid;
  gap: 6px;
  margin: 22px 0;
  padding: 16px;
  background: #f7f5ff;
  border: 1px dashed #c9c0ff;
  border-radius: 10px;
}

.reference-block span {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
}

.reference-block strong {
  color: var(--text-main);
  overflow-wrap: anywhere;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}

.receipt-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 28px;
}

.receipt-grid section {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 6px;
}

.receipt-grid strong {
  color: var(--text-main);
  overflow-wrap: anywhere;
  font-size: 0.95rem;
  line-height: 1.55;
}

.reason-block {
  grid-column: 1 / -1;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.reason-block p {
  margin: 0;
  color: #4b4b55;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.ticket-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px solid var(--border-color);
}

.ticket-footer p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.5;
}

.receipt-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
}

.receipt-actions a {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

.receipt-actions a:hover {
  text-decoration: underline;
}

.receipt-not-found {
  max-width: 640px;
  margin: var(--space-12) auto;
  padding: clamp(24px, 5vw, 42px);
  text-align: center;
}

.empty-mark {
  color: var(--primary);
  background: #f0edff;
}

.receipt-not-found h1 {
  margin: 0 0 8px;
  color: var(--text-main);
}

.receipt-not-found p {
  margin-bottom: 20px;
}

@media print {
  .receipt-heading,
  .receipt-actions,
  .ticket-footer button {
    display: none;
  }

  .receipt-page {
    max-width: none;
    padding: 0;
  }

  .digital-ticket {
    border: 1px solid #ccc;
    box-shadow: none;
  }
}

@media (max-width: 600px) {
  .ticket-banner,
  .ticket-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .receipt-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .reason-block {
    grid-column: auto;
  }

  .receipt-actions {
    flex-direction: column;
  }
}
</style>
