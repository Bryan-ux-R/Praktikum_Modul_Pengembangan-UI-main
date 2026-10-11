<script setup>
const events = [
  {
    id: 1,
    date: '12 Oct 2026',
    category: 'Workshop & Training',
    title: 'Vue.js Mastery Workshop',
    location: 'Tech Hub, Jakarta Pusat',
    description:
      'Level up your frontend skills with hands-on Vue 3, Composition API, and practical project sessions.',
  },
  {
    id: 2,
    date: '15 Oct 2026',
    category: 'Technology',
    title: 'Jakarta Design Systems Meetup',
    location: 'M Bloc Space, Jakarta Selatan',
    description:
      'Meet local product teams and learn how thoughtful design systems help teams build better products.',
  },
  {
    id: 3,
    date: '18 Oct 2026',
    category: 'Community',
    title: 'Creative Founders Connect',
    location: 'Taman Ismail Marzuki, Jakarta Pusat',
    description:
      'An evening to share ideas, connect with creative founders, and find your next collaborator.',
  },
  {
    id: 4,
    date: '22 Oct 2026',
    category: 'Workshop & Training',
    title: 'Product Discovery Sprint',
    location: 'GoWork, Jakarta Selatan',
    description:
      'Practice research and rapid prototyping techniques for turning user needs into useful products.',
  },
  {
    id: 5,
    date: '25 Oct 2026',
    category: 'Technology',
    title: 'Frontend Performance Lab',
    location: 'Tech Hub, Jakarta Pusat',
    description:
      'Explore practical ways to make modern web applications feel faster and work better for everyone.',
  },
  {
    id: 6,
    date: '29 Oct 2026',
    category: 'Community',
    title: 'Jakarta Makers Social',
    location: 'M Bloc Space, Jakarta Selatan',
    description:
      'Share what you are building, get useful feedback, and meet the people shaping the local tech scene.',
  },
]
</script>

<template>
  <section class="event-list-page">
    <header class="header-section">
      <span class="eyebrow">Find your next experience</span>
      <h1 class="section-title">Upcoming Events</h1>
      <p class="section-desc">Discover the latest gatherings and activities happening near you.</p>
    </header>

    <div class="event-grid">
      <article v-for="event in events" :key="event.id" class="event-card">
        <div class="event-body">
          <div class="event-meta">
            <span class="event-date">{{ event.date }}</span>
            <span class="event-category">{{ event.category }}</span>
          </div>
          <h2>{{ event.title }}</h2>
          <p class="event-loc"><span aria-hidden="true">📍</span> {{ event.location }}</p>
          <p class="event-desc">{{ event.description }}</p>
          <div class="card-footer">
            <router-link :to="`/browse/events/${event.id}`" class="btn-link">
              View Event Details <span aria-hidden="true">→</span>
            </router-link>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.event-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4) 0 var(--space-12);
}

.header-section {
  margin-bottom: var(--space-8);
}

.eyebrow {
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-title {
  margin: var(--space-2) 0;
  color: var(--text-main);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.section-desc {
  margin: 0;
  color: var(--text-muted);
  font-size: 1.05rem;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.event-card {
  display: flex;
  min-width: 0;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  border-color: #c9c0ff;
  box-shadow: 0 14px 30px rgba(28, 25, 72, 0.08);
}

.event-body {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: var(--space-6);
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.event-date {
  padding: var(--space-1) var(--space-3);
  color: var(--primary);
  background: #f0edff;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.event-body h2 {
  margin: 0 0 var(--space-3);
  color: var(--text-main);
  font-size: 1.25rem;
  font-weight: 700;
}

.event-loc {
  margin: 0 0 var(--space-4);
  color: var(--text-muted);
  font-size: 0.92rem;
}

.event-desc {
  flex-grow: 1;
  margin: 0 0 var(--space-6);
  color: #555;
  font-size: 0.95rem;
  line-height: 1.65;
}

.card-footer {
  padding-top: var(--space-4);
  border-top: 1px solid #f0f0f0;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-main);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

.btn-link:hover {
  color: var(--primary);
}

@media (max-width: 380px) {
  .event-grid {
    grid-template-columns: 1fr;
  }
}
</style>
