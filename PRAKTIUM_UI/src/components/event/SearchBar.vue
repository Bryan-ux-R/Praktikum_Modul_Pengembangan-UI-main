<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search events...',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="search-bar">
    <span class="search-icon" aria-hidden="true">⌕</span>
    <input
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      aria-label="Search events"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<style scoped>
.search-bar {
  display: flex;
  min-width: 0;
  min-height: 48px;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid var(--border-color, #e4e4e7);
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar:focus-within {
  border-color: var(--primary, #6644ff);
  box-shadow: 0 0 0 3px rgba(102, 68, 255, 0.12);
}

.search-icon {
  color: var(--text-muted, #666);
  font-size: 1.5rem;
  line-height: 1;
}

.search-bar input {
  width: 100%;
  min-width: 0;
  padding: 0;
  color: var(--text-main, #1c1948);
  background: transparent;
  border: 0;
  outline: 0;
  font: inherit;
}

.search-bar input::placeholder {
  color: #92919c;
}
</style>
