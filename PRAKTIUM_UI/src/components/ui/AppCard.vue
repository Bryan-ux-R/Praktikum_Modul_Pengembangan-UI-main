<script setup>
defineProps({
  tag: {
    type: String,
    default: 'div',
  },
})
</script>

<template>
  <component :is="tag" class="app-card">
    <slot />
  </component>
</template>

<style scoped>
.app-card {
  min-width: 0;
  padding: var(--app-card-padding, 24px);
  color: inherit;
  background: #fff;
  border: 1px solid var(--border-color, #e4e4e7);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(28, 25, 72, 0.035);
}
</style>
