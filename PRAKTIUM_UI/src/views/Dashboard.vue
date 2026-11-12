<script setup>
import { computed, onMounted } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useEvents } from '@/composables/useEvents'

const {
  totalEvents,
  activeEvents,
  completedEvents,
  formatEventDate,
  storageError,
  loading,
  error: apiError,
  fetchEvents,
} = useEvents()

const loadEvents = async () => {
  try {
    await fetchEvents()
  } catch {
    // The composable exposes the failure in the dashboard.
  }
}

onMounted(loadEvents)

const metrics = computed(() => [
  {
    label: 'Total events',
    value: String(totalEvents.value).padStart(2, '0'),
    note: 'Across your community',
    icon: '◇',
  },
  {
    label: 'Active events',
    value: String(activeEvents.value.length).padStart(2, '0'),
    note: 'Open to attendees',
    icon: '♧',
  },
  {
    label: 'Completed events',
    value: String(completedEvents.value.length).padStart(2, '0'),
    note: 'In your event archive',
    icon: '▣',
  },
])

const upcomingEvents = computed(() => activeEvents.value.slice(0, 3))
</script>

<template>
  <div class="dashboard-content">
    <p v-if="storageError" class="storage-warning" role="alert">{{ storageError }}</p>
    <div v-if="apiError" class="storage-warning" role="alert">
      <span>{{ apiError }}</span>
      <AppButton variant="secondary" :loading="loading" @click="loadEvents">Try again</AppButton>
    </div>

    <section class="metrics-grid" aria-label="Event summary">
      <article v-for="metric in metrics" :key="metric.label" class="metric-card">
        <div class="metric-top">
          <span>{{ metric.label }}</span>
          <span class="metric-icon" aria-hidden="true">{{ metric.icon }}</span>
        </div>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.note }}</small>
      </article>
    </section>

    <section class="events-panel">
      <header class="panel-header">
        <div>
          <span class="panel-kicker">YOUR CALENDAR</span>
          <h2>Active events</h2>
        </div>
        <router-link to="/dashboard/events"
          >Manage events <span aria-hidden="true">→</span></router-link
        >
      </header>

      <div class="event-table">
        <div class="table-heading">
          <span>EVENT</span>
          <span>CATEGORY</span>
          <span>DATE &amp; LOCATION</span>
        </div>
        <router-link
          v-for="event in upcomingEvents"
          :key="event.title"
          :to="`/browse/events/${event.id}`"
          class="event-row"
        >
          <span class="event-name">
            <strong>{{ event.title }}</strong>
          </span>
          <span class="event-category">{{ event.category }}</span>
          <span class="event-location">
            <time>{{ formatEventDate(event.date) }}</time>
            {{ event.location }}
          </span>
        </router-link>
        <div v-if="!upcomingEvents.length" class="dashboard-empty">
          <p>There are no active events at the moment.</p>
          <router-link to="/dashboard/events">Create your first event</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-content {
  display: grid;
  gap: var(--space-8);
}

.storage-warning {
  margin: 0;
  padding: 12px 16px;
  color: #a12533;
  background: #fff3f4;
  border: 1px solid #f1c8cc;
  border-radius: 10px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.metric-card,
.events-panel {
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.metric-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: var(--space-6);
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: 0.88rem;
}

.metric-icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  color: var(--primary);
  background: #f0edff;
  border-radius: 10px;
  font-size: 1.2rem;
}

.metric-card > strong {
  margin: var(--space-4) 0 var(--space-1);
  color: var(--text-main);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.metric-card > small {
  color: #898894;
  font-size: 0.8rem;
}

.events-panel {
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.panel-kicker {
  color: var(--primary);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.panel-header h2 {
  margin: var(--space-1) 0 0;
  color: var(--text-main);
  font-size: 1.35rem;
  font-weight: 750;
}

.panel-header a {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

.table-heading,
.event-row {
  display: grid;
  grid-template-columns: minmax(200px, 1.6fr) minmax(110px, 0.8fr) minmax(120px, 0.8fr);
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
}

.table-heading {
  color: #898894;
  background: #fbfbfd;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.event-row {
  color: inherit;
  border-top: 1px solid #f0f0f2;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.event-row:hover {
  background: #fbfaff;
}

.event-name strong {
  display: block;
}

.event-name strong {
  color: var(--text-main);
  font-size: 0.92rem;
}

.event-category,
.event-location {
  color: #666573;
  font-size: 0.85rem;
}

.event-location {
  display: grid;
  gap: 2px;
}

.event-location time {
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 700;
}

.dashboard-empty {
  padding: var(--space-8);
  text-align: center;
}

.dashboard-empty p {
  margin: 0 0 var(--space-3);
  color: var(--text-muted);
}

.dashboard-empty a {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
}

.dashboard-empty a:hover {
  text-decoration: underline;
}

@media (max-width: 800px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metric-card {
    padding: var(--space-4);
  }

  .event-table {
    overflow-x: auto;
  }

  .table-heading,
  .event-row {
    min-width: 600px;
  }
}
</style>
