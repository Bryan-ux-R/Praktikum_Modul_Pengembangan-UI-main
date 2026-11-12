<script setup>
import { useEvents } from '@/composables/useEvents'

defineProps({
  registration: {
    type: Object,
    required: true,
  },
})

const { formatEventDate } = useEvents()
</script>

<template>
  <section class="receipt-summary" aria-label="Registration ticket summary">
    <div class="receipt-reference">
      <span>Ticket reference</span>
      <strong>{{ registration.id }}</strong>
    </div>
    <dl class="receipt-details">
      <div>
        <dt>Attendee</dt>
        <dd>{{ registration.name }}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{{ registration.email }}</dd>
      </div>
      <div>
        <dt>Phone</dt>
        <dd>{{ registration.phone }}</dd>
      </div>
      <div>
        <dt>Date of birth</dt>
        <dd>{{ registration.dateOfBirth }}</dd>
      </div>
      <div>
        <dt>Event</dt>
        <dd>{{ registration.eventTitle }}</dd>
      </div>
      <div>
        <dt>Date &amp; location</dt>
        <dd>{{ formatEventDate(registration.eventDate) }} · {{ registration.eventLocation }}</dd>
      </div>
      <div>
        <dt>Reason for attending</dt>
        <dd>{{ registration.reason }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.receipt-summary {
  display: grid;
  gap: 16px;
  text-align: left;
}

.receipt-reference {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  color: #5636da;
  background: #f3f0ff;
  border: 1px dashed #bdb1ff;
  border-radius: 10px;
}

.receipt-reference span,
.receipt-details dt {
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 600;
}

.receipt-reference strong {
  color: var(--text-main);
  overflow-wrap: anywhere;
  font-size: 1rem;
  letter-spacing: 0.04em;
}

.receipt-details {
  display: grid;
  gap: 12px;
  margin: 0;
}

.receipt-details > div {
  display: grid;
  gap: 3px;
}

.receipt-details dd {
  margin: 0;
  color: var(--text-main);
  font-size: 0.88rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
</style>
