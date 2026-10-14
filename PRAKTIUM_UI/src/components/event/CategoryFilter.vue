<script setup>
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="category-filter" role="group" aria-label="Filter events by category">
    <AppButton
      variant="secondary"
      class="filter-button"
      :class="{ active: modelValue === '' }"
      :aria-pressed="modelValue === ''"
      @click="$emit('update:modelValue', '')"
    >
      All events
    </AppButton>
    <AppButton
      v-for="category in categories"
      :key="category"
      variant="secondary"
      class="filter-button"
      :class="{ active: modelValue === category }"
      :aria-pressed="modelValue === category"
      @click="$emit('update:modelValue', category)"
    >
      {{ category }}
    </AppButton>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-button {
  min-height: 36px;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.84rem;
}

.filter-button.active {
  color: #fff;
  background: var(--primary, #6644ff);
  border-color: var(--primary, #6644ff);
}

.filter-button.active:hover {
  background: var(--primary-hover, #5533ee);
}
</style>
