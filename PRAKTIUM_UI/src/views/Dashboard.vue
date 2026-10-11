<script setup>
const metrics = [
  { label: 'Published events', value: '06', note: 'Across your community', icon: '◇' },
  { label: 'Total registrations', value: '248', note: 'Across all events', icon: '♧' },
  { label: 'Next event', value: '12 Oct', note: 'Vue.js Mastery Workshop', icon: '▣' },
]

const upcomingEvents = [
  {
    date: '12 OCT',
    title: 'Vue.js Mastery Workshop',
    category: 'Workshop',
    attendees: '138 / 150',
  },
  {
    date: '15 OCT',
    title: 'Jakarta Design Systems Meetup',
    category: 'Technology',
    attendees: '64 / 100',
  },
  {
    date: '18 OCT',
    title: 'Creative Founders Connect',
    category: 'Community',
    attendees: '42 / 80',
  },
]
</script>

<template>
  <div class="dashboard-content">
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
          <h2>Upcoming events</h2>
        </div>
        <router-link to="/browse/events">View all <span aria-hidden="true">→</span></router-link>
      </header>

      <div class="event-table">
        <div class="table-heading">
          <span>EVENT</span>
          <span>CATEGORY</span>
          <span>REGISTRATIONS</span>
        </div>
        <router-link
          v-for="event in upcomingEvents"
          :key="event.title"
          :to="`/browse/events/${event.title === 'Vue.js Mastery Workshop' ? 1 : event.date === '15 OCT' ? 2 : 3}`"
          class="event-row"
        >
          <span class="event-name">
            <time>{{ event.date }}</time>
            <strong>{{ event.title }}</strong>
          </span>
          <span class="event-category">{{ event.category }}</span>
          <span class="attendee-count">{{ event.attendees }}</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-content {
  display: grid;
  gap: var(--space-8);
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

.event-name time,
.event-name strong {
  display: block;
}

.event-name time {
  margin-bottom: var(--space-1);
  color: var(--primary);
  font-size: 0.7rem;
  font-weight: 700;
}

.event-name strong {
  color: var(--text-main);
  font-size: 0.92rem;
}

.event-category,
.attendee-count {
  color: #666573;
  font-size: 0.85rem;
}

.attendee-count {
  font-weight: 700;
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
