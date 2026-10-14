<script setup lang="ts">
import Navbar from '@/components/app/Navbar.vue';
import Breadcrumb from '@/components/app/Breadcrumb.vue';
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content" :class="{ 'home-content': $route.name === 'home' }">
      <Breadcrumb />
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 2rem clamp(16px, 4vw, 64px);
}

.main-content.home-content {
  padding: 20px clamp(16px, 2.3vw, 32px) 0;
}

.home-content :deep(.breadcrumb) {
  margin-bottom: 10px;
  padding: 0 10px;
  background: transparent;
  border-radius: 0;
  font-size: 0.8rem;
}

.home-content :deep(.active-crumb) {
  color: #a3a3a3;
  font-weight: 400;
}
</style>
