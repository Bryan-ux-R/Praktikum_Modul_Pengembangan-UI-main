<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="dashboard-layout">
    <aside class="dashboard-rail">
      <router-link to="/" class="brand">
        <span class="brand-mark" aria-hidden="true">G</span>
        <span>Gatherly</span>
      </router-link>

      <div class="organizer-label">ORGANIZER</div>
      <nav aria-label="Organizer navigation">
        <router-link
          to="/dashboard"
          class="rail-link"
          :class="{ active: route.path === '/dashboard' }"
        >
          <span aria-hidden="true">▦</span> Overview
        </router-link>
        <router-link
          to="/browse/events"
          class="rail-link"
          :class="{ active: route.path.startsWith('/browse/events') }"
        >
          <span aria-hidden="true">◇</span> Browse Events
        </router-link>
      </nav>

      <router-link to="/" class="back-link">← Back to Gatherly</router-link>
    </aside>

    <main class="dashboard-pane">
      <header class="pane-header">
        <div>
          <p class="header-kicker">MONDAY, 12 OCTOBER 2026</p>
          <h1>Organizer Dashboard</h1>
        </div>
        <router-link to="/browse/events" class="view-events"
          >Explore events <span>↗</span></router-link
        >
      </header>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 250px minmax(0, 1fr);
  color: var(--text-main);
  background: #f8f8fb;
}

.dashboard-rail {
  position: sticky;
  top: 0;
  display: flex;
  height: 100vh;
  flex-direction: column;
  padding: var(--space-6) var(--space-4);
  background: #fff;
  border-right: 1px solid var(--border-color);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-12);
  color: var(--text-main);
  font-size: 1.2rem;
  font-weight: 800;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: #fff;
  background: var(--primary);
  border-radius: 12px;
}

.organizer-label,
.header-kicker {
  color: #898894;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.organizer-label {
  margin: 0 var(--space-3) var(--space-3);
}

.dashboard-rail nav {
  display: grid;
  gap: var(--space-2);
}

.rail-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  color: #666573;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
}

.rail-link:hover,
.rail-link.active {
  color: var(--primary);
  background: #f0edff;
}

.back-link {
  margin-top: auto;
  padding: var(--space-3);
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary);
}

.dashboard-pane {
  min-width: 0;
  padding: clamp(1.25rem, 4vw, 3.5rem);
}

.pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.header-kicker {
  margin: 0 0 var(--space-2);
}

.pane-header h1 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.view-events {
  padding: var(--space-3) var(--space-4);
  color: var(--primary);
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

@media (max-width: 700px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .dashboard-rail {
    position: static;
    height: auto;
    padding: var(--space-4);
    border-right: 0;
    border-bottom: 1px solid var(--border-color);
  }

  .brand {
    margin-bottom: var(--space-4);
  }

  .dashboard-rail nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .back-link {
    margin-top: var(--space-2);
  }

  .pane-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
