<script setup>
import { computed, onMounted } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useEvents } from '@/composables/useEvents'

const { activeEvents, categories, fetchEvents, loading, error } = useEvents()

const loadEvents = async () => {
  try {
    await fetchEvents()
  } catch {
    // The error state below presents the composable's API error.
  }
}

onMounted(loadEvents)

const categoryCards = computed(() =>
  categories.value.map((name) => ({
    name,
    count: activeEvents.value.filter((event) => event.category === name).length,
    icon:
      {
        'Music & Concerts': '🎵',
        Technology: '💻',
        'Art & Design': '🎨',
        Business: '💼',
        'Health & Wellness': '🧘',
        'Food & Drink': '🍔',
        Community: '◇',
        'Workshop & Training': '✦',
      }[name] || '◇',
  })),
)
</script>

<template>
  <div class="category-page">
    <h2 class="section-title">Explore by Category</h2>
    <div v-if="loading" class="category-empty" role="status">Loading event categories…</div>
    <div v-else-if="error" class="category-empty category-error" role="alert">
      <p>{{ error }}</p>
      <AppButton :loading="loading" @click="loadEvents">Try again</AppButton>
    </div>
    <div v-else-if="categoryCards.length" class="category-grid">
      <router-link
        v-for="cat in categoryCards"
        :key="cat.name"
        :to="{ name: 'events', query: { category: cat.name } }"
        class="category-card"
      >
        <div class="cat-icon">{{ cat.icon }}</div>
        <h3>{{ cat.name }}</h3>
        <p>{{ cat.count }} Events</p>
      </router-link>
    </div>
    <div v-else class="category-empty">
      <p>There are no event categories to explore yet.</p>
      <router-link to="/dashboard/events">Create an event</router-link>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 1.8rem;
  color: #1c1948;
  margin-bottom: 2rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.category-card {
  display: block;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border-color: #6644ff;
}

.cat-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.category-card h3 {
  color: #1c1948;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.category-card p {
  color: #888;
  font-size: 0.9rem;
}

.category-empty {
  padding: 2rem;
  color: var(--text-muted);
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: center;
}

.category-empty p {
  margin: 0 0 0.75rem;
}

.category-empty a {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
}

.category-error p {
  margin-bottom: 1rem;
  overflow-wrap: anywhere;
}
</style>
