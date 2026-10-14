<script setup>
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})

defineEmits(['view-detail'])
</script>

<template>
  <AppCard tag="article" class="event-card">
    <div class="event-body">
      <div class="event-meta">
        <span class="event-date">{{ event.date }}</span>
        <span class="event-category">{{ event.category }}</span>
      </div>
      <h2>{{ event.title }}</h2>
      <p class="event-loc"><span aria-hidden="true">📍</span> {{ event.location }}</p>
      <p class="event-desc">{{ event.description }}</p>
      <div class="card-footer">
        <AppButton
          variant="secondary"
          class="view-button"
          @click="$emit('view-detail', event.id)"
        >
          View Event Details <span aria-hidden="true">→</span>
        </AppButton>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.event-card {
  display: flex;
  min-height: 100%;
  padding: 0;
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
  padding: var(--space-6, 24px);
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2, 8px);
  margin-bottom: var(--space-4, 16px);
}

.event-date {
  padding: var(--space-1, 4px) var(--space-3, 12px);
  color: var(--primary, #6644ff);
  background: #f0edff;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
}

.event-category {
  color: var(--text-muted, #666);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.event-body h2 {
  margin: 0 0 var(--space-3, 12px);
  color: var(--text-main, #1c1948);
  font-size: 1.25rem;
  font-weight: 700;
}

.event-loc {
  margin: 0 0 var(--space-4, 16px);
  color: var(--text-muted, #666);
  font-size: 0.92rem;
}

.event-desc {
  flex-grow: 1;
  margin: 0 0 var(--space-6, 24px);
  color: #555;
  font-size: 0.95rem;
  line-height: 1.65;
}

.card-footer {
  padding-top: var(--space-4, 16px);
  border-top: 1px solid #f0f0f0;
}

.view-button {
  min-height: 38px;
  padding: 0.4rem 0;
  border: 0;
  box-shadow: none;
  font-size: 0.9rem;
}
</style>
