<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CategoryFilter from '@/components/event/CategoryFilter.vue'
import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const selectedCategory = ref(typeof route.query.category === 'string' ? route.query.category : '')
const { activeEvents, categories, isUserRegistered, fetchEvents, loading, error } = useEvents()

const loadEvents = async () => {
  try {
    await fetchEvents()
  } catch {
    // The composable exposes the request error for the error state below.
  }
}

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  return activeEvents.value.filter((event) => {
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

watch(
  () => route.query.category,
  (category) => {
    selectedCategory.value = typeof category === 'string' ? category : ''
  },
)

watch(selectedCategory, (category) => {
  const query = { ...route.query }

  if (category) {
    query.category = category
  } else {
    delete query.category
  }

  router.replace({ query })
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const viewEvent = (eventId) => {
  router.push({ name: 'event-detail', params: { id: eventId } })
}

onMounted(loadEvents)
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

    <div v-if="loading" class="event-grid" role="status" aria-label="Loading events">
      <AppCard v-for="item in 3" :key="item" class="event-skeleton">
        <span class="skeleton-line skeleton-title"></span>
        <span class="skeleton-line"></span>
        <span class="skeleton-line skeleton-short"></span>
      </AppCard>
    </div>

    <AppCard v-else-if="error" tag="section" class="empty-state api-error" role="alert">
      <span class="empty-icon" aria-hidden="true">!</span>
      <h2>Events could not be loaded</h2>
      <p>{{ error }}</p>
      <AppButton :loading="loading" :disabled="loading" @click="loadEvents">Try again</AppButton>
    </AppCard>

    <template v-else>
      <p class="results-count" role="status" aria-live="polite">
        {{ filteredEvents.length }} {{ filteredEvents.length === 1 ? 'event' : 'events' }} found
      </p>

      <div v-if="filteredEvents.length" class="event-grid">
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          :is-registered="isUserRegistered(event.id)"
          @view-detail="viewEvent"
        />
      </div>

      <AppCard v-else-if="activeEvents.length" tag="section" class="empty-state" aria-live="polite">
        <span class="empty-icon" aria-hidden="true">⌕</span>
        <h2>No events found</h2>
        <p>Try another search or choose a different category.</p>
        <AppButton variant="secondary" @click="clearFilters">Clear filters</AppButton>
      </AppCard>
      <AppCard v-else tag="section" class="empty-state" aria-live="polite">
        <span class="empty-icon" aria-hidden="true">◇</span>
        <h2>No active events yet</h2>
        <p>Check back soon or create an event from the organizer dashboard.</p>
        <AppButton @click="router.push('/dashboard/events')">Create an event</AppButton>
      </AppCard>
    </template>
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

.event-skeleton {
  display: grid;
  align-content: start;
  gap: var(--space-4);
  min-height: 210px;
  padding: var(--space-6);
}

.api-error p {
  overflow-wrap: anywhere;
}

@media (max-width: 650px) {
  .event-grid {
    grid-template-columns: 1fr;
  }
}
</style>
