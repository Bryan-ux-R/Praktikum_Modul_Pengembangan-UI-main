<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'

const route = useRoute()
const { events, formatEventDate } = useEvents()
const event = computed(() =>
  events.value.find((item) => String(item.id) === String(route.params.id)),
)

const registerForEvent = () => {
  if (!event.value) {
    return
  }

  window.location.href = `mailto:hello@gatherly.com?subject=${encodeURIComponent(
    `Registration for ${event.value.title}`,
  )}`
}
</script>

<template>
  <article v-if="event" class="event-detail-page">
    <router-link to="/browse/events" class="btn-back">← Back to Events</router-link>

    <header class="detail-header">
      <div class="header-content">
        <span class="event-tag">{{ event.category }}</span>
        <h1>{{ event.title }}</h1>
        <div class="meta-info">
          <div class="meta-item">
            <span aria-hidden="true">📅</span><span>{{ formatEventDate(event.date) }}</span>
          </div>
          <div class="meta-item">
            <span aria-hidden="true">📍</span><span>{{ event.location }}</span>
          </div>
          <div class="meta-item"><span aria-hidden="true">👥</span><span>150 peserta</span></div>
        </div>
      </div>
    </header>

    <div class="detail-grid grid-asymmetric">
      <section class="main-desc">
        <span class="section-eyebrow">Learn by building</span>
        <h2>About This Event</h2>
        <p>{{ event.description }}</p>
        <p>Join us at {{ event.location }} and connect with others who share your interests.</p>

        <h2 class="agenda-heading">Event Agenda</h2>
        <ol class="agenda-list">
          <li><time>09.00</time><span>Registration &amp; welcome coffee</span></li>
          <li><time>09.30</time><span>Vue 3 essentials and project setup</span></li>
          <li><time>10.45</time><span>Composition API and reusable components</span></li>
          <li><time>13.00</time><span>Build a hands-on event discovery feature</span></li>
          <li><time>15.00</time><span>Q&amp;A, project sharing, and closing</span></li>
        </ol>
      </section>

      <aside class="sidebar sticky-pane">
        <AppCard class="ticket-card">
          <span class="ticket-kicker">Save your seat</span>
          <h2>Registration</h2>
          <p class="price">Free</p>
          <p class="ticket-desc">Save your seat and join the community at {{ event.title }}.</p>
          <AppButton v-if="!event.done" class="btn-register" @click="registerForEvent">
            Register Now
          </AppButton>
          <p v-else class="completed-notice">This event has been completed.</p>
        </AppCard>
      </aside>
    </div>
  </article>
  <AppCard v-else tag="section" class="event-not-found">
    <h1>Event not found</h1>
    <p>This event may have been removed or is no longer available.</p>
    <router-link to="/browse/events" class="btn-back">Back to Events</router-link>
  </AppCard>
</template>

<style scoped>
.event-not-found {
  max-width: 720px;
  margin: var(--space-12) auto;
  text-align: center;
}

.event-not-found h1 {
  margin: 0 0 var(--space-2);
}

.event-not-found p {
  margin: 0 0 var(--space-4);
  color: var(--text-muted);
}

.event-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4) 0 var(--space-12);
}

.btn-back {
  display: inline-block;
  margin-bottom: var(--space-6);
  color: var(--text-muted);
  font-weight: 600;
  text-decoration: none;
}

.btn-back:hover {
  color: var(--primary);
}

.detail-header {
  margin-bottom: var(--space-8);
  padding: clamp(2rem, 5vw, 4rem);
  background: linear-gradient(120deg, #fbfaff 0%, #f3f0ff 100%);
  border: 1px solid #eeebff;
  border-radius: 22px;
}

.header-content {
  max-width: 850px;
}

.event-tag,
.ticket-kicker {
  display: inline-block;
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header-content h1 {
  margin: var(--space-3) 0 var(--space-6);
  color: var(--text-main);
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1.1;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4) var(--space-8);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: #555;
  font-weight: 500;
}

.grid-asymmetric {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: var(--space-12);
}

.main-desc {
  min-width: 0;
}

.section-eyebrow {
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.main-desc h2 {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-2) 0 var(--space-4);
  color: var(--text-main);
  font-size: 1.7rem;
  font-weight: 750;
}

.main-desc > h2::before {
  width: 20px;
  height: 4px;
  background: var(--primary);
  border-radius: 2px;
  content: '';
}

.main-desc p {
  margin: 0 0 var(--space-4);
  color: #4b4b55;
  font-size: 1.02rem;
  line-height: 1.8;
}

.main-desc .agenda-heading {
  margin-top: var(--space-8);
}

.agenda-list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.agenda-list li {
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: var(--space-3);
  padding: var(--space-4);
  color: #444;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  line-height: 1.5;
}

.agenda-list time {
  color: var(--primary);
  font-weight: 700;
}

.sidebar {
  min-width: 0;
}

.sticky-pane {
  position: sticky;
  top: 100px;
  align-self: start;
}

.ticket-card {
  --app-card-padding: var(--space-8);
  text-align: center;
  border-radius: 18px;
  box-shadow: 0 12px 35px rgba(28, 25, 72, 0.06);
}

.ticket-card h2 {
  margin: var(--space-2) 0;
  color: var(--text-main);
  font-size: 1.4rem;
}

.price {
  margin: 0 0 var(--space-2);
  color: var(--primary);
  font-size: 2.8rem;
  font-weight: 800;
}

.ticket-desc {
  margin: 0 0 var(--space-6);
  color: var(--text-muted);
  line-height: 1.6;
}

.btn-register {
  width: 100%;
  padding: var(--space-4);
  border-radius: 10px;
}

.completed-notice {
  margin: var(--space-4) 0 0;
  color: #24633d;
  font-size: 0.9rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .sticky-pane {
    position: static;
  }
}
</style>
