<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="app-button"
    :class="`app-button--${variant}`"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.65rem 1.2rem;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.app-button:hover {
  transform: translateY(-1px);
}

.app-button--primary {
  color: #fff;
  background: var(--primary, #6644ff);
  box-shadow: 0 7px 15px rgba(102, 68, 255, 0.2);
}

.app-button--primary:hover {
  background: var(--primary-hover, #5533ee);
}

.app-button--secondary {
  color: var(--text-main, #1c1948);
  background: #fff;
  border-color: var(--border-color, #e4e4e7);
}

.app-button--secondary:hover {
  color: var(--primary, #6644ff);
  border-color: var(--primary, #6644ff);
}

.app-button:focus-visible {
  outline: 3px solid rgba(102, 68, 255, 0.3);
  outline-offset: 2px;
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}
</style>
