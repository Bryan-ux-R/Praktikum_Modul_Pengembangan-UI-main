<script setup lang="ts">
import Navbar from '@/components/app/Navbar.vue';
import Breadcrumb from '@/components/app/Breadcrumb.vue';
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <Breadcrumb v-if="$route.name !== 'home'" />
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
</style>
