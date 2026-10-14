<script setup>
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'

const router = useRouter()

const browseEvents = () => router.push({ name: 'events' })
</script>

<template>
  <div class="home-page">
    <AppCard tag="section" class="hero-section">
      <h1>Connect, Discover, and Experience</h1>
      <p>
        A community event platform designed to bring ideas together.<br class="desktop-break" />
        Discover hundreds of events near you.
      </p>
      <AppButton class="hero-button" @click="browseEvents">Discover Events</AppButton>
    </AppCard>

    <section class="features-section" aria-labelledby="features-title">
      <header class="features-header">
        <h2 id="features-title">Why Choose Gatherly?</h2>
        <p>Everything you need to host or attend unforgettable events.</p>
      </header>

      <div class="features-grid">
        <AppCard tag="article" class="feature-card">
          <span class="feature-icon discover-icon" aria-hidden="true">🔍</span>
          <h3>Discover Easily</h3>
          <p>Explore events and find the right experience for your interests.</p>
        </AppCard>
        <AppCard tag="article" class="feature-card">
          <span class="feature-icon ticket-icon" aria-hidden="true">🎟️</span>
          <h3>Seamless Ticketing</h3>
          <p>Keep event details and registration simple and all in one place.</p>
        </AppCard>
        <AppCard tag="article" class="feature-card">
          <span class="feature-icon host-icon" aria-hidden="true">📊</span>
          <h3>Host Like a Pro</h3>
          <p>Bring your community together and make planning easier.</p>
        </AppCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  display: flex;
  min-height: 84vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 24px;
  text-align: center;
  --app-card-padding: 40px 24px 24px;
  border-radius: 17px;
}

.hero-section h1 {
  max-width: 560px;
  margin: 0 0 26px;
  color: var(--text-main);
  font-size: clamp(2.25rem, 5vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.04;
}

.hero-section p {
  margin: 0 0 12px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.hero-button {
  min-height: 32px;
  padding: 0.5rem 1.3rem;
  font-size: 0.82rem;
  border-radius: 9px;
}

.features-section {
  padding: 0 clamp(16px, 4vw, 38px);
}

.features-header {
  margin: 0 auto 14px;
  text-align: center;
}

.features-header h2 {
  margin: 0 0 6px;
  color: var(--text-main);
  font-size: 1.05rem;
  font-weight: 750;
}

.features-header p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.7rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.feature-card {
  min-width: 0;
  --app-card-padding: 16px 12px;
  text-align: center;
  border-radius: 10px;
}

.feature-icon {
  display: block;
  margin-bottom: 9px;
  font-size: 1.35rem;
  line-height: 1;
}

.feature-card h3 {
  margin: 0 0 6px;
  color: var(--text-main);
  font-size: 0.72rem;
  font-weight: 700;
}

.feature-card p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.68rem;
  line-height: 1.5;
}

@media (max-width: 520px) {
  .hero-section {
    min-height: 76vh;
    padding-inline: 18px;
  }

  .hero-section h1 {
    margin-bottom: 20px;
    font-size: clamp(2rem, 9vw, 2.5rem);
  }

  .desktop-break {
    display: none;
  }

  .home-page {
    gap: 40px;
  }

  .features-section {
    padding-inline: 0;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
