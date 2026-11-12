<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import CategoryFilter from '@/components/event/CategoryFilter.vue'
import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('')

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

const categories = [...new Set(events.map((event) => event.category))]

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  return events.filter((event) => {
    const matchesCategory = !selectedCategory.value || event.category === selectedCategory.value
    const searchableText = [
      event.title,
      event.description,
      event.location,
      event.category,
      event.date,
    ]
      .join(' ')
      .toLocaleLowerCase()

    return matchesCategory && (!query || searchableText.includes(query))
  })
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const viewEvent = (eventId) => {
  router.push({ name: 'event-detail', params: { id: eventId } })
}
</script>

<template>
  <section class="event-list-page">
    <header class="header-section">
      <span class="eyebrow">Find your next experience</span>
      <h1 class="section-title">Upcoming Events</h1>
      <p class="section-desc">Discover the latest gatherings and activities happening near you.</p>
    </header>

    <section class="event-controls" aria-label="Search and filter events">
      <SearchBar v-model="searchQuery" />
      <CategoryFilter v-model="selectedCategory" :categories="categories" />
    </section>

    <p class="results-count" role="status" aria-live="polite">
      {{ filteredEvents.length }} {{ filteredEvents.length === 1 ? 'event' : 'events' }} found
    </p>

    <div v-if="filteredEvents.length" class="event-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @view-detail="viewEvent"
      />
    </div>

    <AppCard v-else tag="section" class="empty-state" aria-live="polite">
      <span class="empty-icon" aria-hidden="true">⌕</span>
      <h2>No events found</h2>
      <p>Try another search or choose a different category.</p>
      <AppButton variant="secondary" @click="clearFilters">Clear filters</AppButton>
    </AppCard>
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

.event-controls {
  display: grid;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.results-count {
  margin: 0 0 var(--space-4);
  color: var(--text-muted);
  font-size: 0.88rem;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  align-items: stretch;
  gap: var(--space-6);
}

.empty-state {
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

@media (max-width: 650px) {
  .event-grid {
    grid-template-columns: 1fr;
  }
}
</style>
