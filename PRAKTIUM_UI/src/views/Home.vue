<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-copy">
        <span class="eyebrow">Make room for memorable moments</span>
        <h1 class="hero-title">Connect, Discover, and Experience</h1>
        <p class="hero-subtitle">
          Find experiences worth sharing. Gatherly brings your community together through events
          made for learning, meeting, and having a great time.
        </p>
        <router-link to="/browse/events" class="btn-primary">
          Discover Events <span aria-hidden="true">→</span>
        </router-link>
      </div>

      <div class="hero-art" aria-label="A preview of events happening on Gatherly">
        <div class="art-orbit orbit-one"></div>
        <div class="art-orbit orbit-two"></div>
        <div class="event-preview preview-main">
          <span class="preview-icon">✦</span>
          <span class="preview-label">UP NEXT</span>
          <strong>Ideas that bring us together</strong>
          <span class="preview-place">Jakarta · This October</span>
        </div>
        <div class="event-preview preview-float">
          <span class="avatar-stack" aria-hidden="true"><i>G</i><i>A</i><i>+</i></span>
          <span><strong>Good company</strong><small>Starts with one event</small></span>
        </div>
        <span class="art-sparkle sparkle-one" aria-hidden="true">✳</span>
        <span class="art-sparkle sparkle-two" aria-hidden="true">✦</span>
      </div>
    </section>

    <section class="features-section">
      <header class="features-header">
        <span class="eyebrow">The Gatherly difference</span>
        <h2>Why Choose Gatherly?</h2>
        <p>Everything you need to find your people and make every gathering count.</p>
      </header>

      <div class="features-grid">
        <article class="feature-card">
          <span class="feature-icon icon-discover" aria-hidden="true">⌕</span>
          <h3>Discover Easily</h3>
          <p>Explore inspiring events and find the right experience for your interests.</p>
        </article>
        <article class="feature-card">
          <span class="feature-icon icon-ticket" aria-hidden="true">◇</span>
          <h3>Seamless Ticketing</h3>
          <p>Keep event details and registration simple, clear, and all in one place.</p>
        </article>
        <article class="feature-card">
          <span class="feature-icon icon-host" aria-hidden="true">↗</span>
          <h3>Host Like a Pro</h3>
          <p>Bring your community together and make planning your next event easier.</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4) 0 var(--space-12);
}

.hero-section {
  min-height: 65vh;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: var(--space-8);
  padding: clamp(2rem, 6vw, 5rem);
  overflow: hidden;
  background: linear-gradient(120deg, #fbfaff 0%, #f3f0ff 100%);
  border: 1px solid #eeebff;
  border-radius: 32px;
}

.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 610px;
}

.eyebrow {
  display: inline-block;
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.hero-title {
  margin: var(--space-4) 0;
  color: var(--text-main);
  font-size: clamp(2.6rem, 5.5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 1.08;
}

.hero-subtitle {
  max-width: 530px;
  margin: 0 0 var(--space-8);
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.75;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0.95rem 1.4rem;
  color: #fff;
  background: var(--primary);
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(102, 68, 255, 0.2);
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: var(--primary-hover);
}

.hero-art {
  position: relative;
  display: grid;
  min-height: 340px;
  place-items: center;
}

.art-orbit {
  position: absolute;
  border: 1px solid rgba(102, 68, 255, 0.12);
  border-radius: 50%;
}

.orbit-one {
  width: min(31vw, 360px);
  aspect-ratio: 1;
}

.orbit-two {
  width: min(23vw, 270px);
  aspect-ratio: 1;
}

.event-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #efedfa;
  box-shadow: 0 24px 65px rgba(39, 28, 93, 0.12);
}

.preview-main {
  width: min(330px, 78%);
  min-height: 215px;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: var(--space-6);
  border-radius: 22px;
  transform: rotate(-4deg);
}

.preview-icon {
  position: absolute;
  top: 20px;
  right: 22px;
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  color: #fff;
  background: var(--primary);
  border-radius: 16px;
  font-size: 1.8rem;
}

.preview-label,
.preview-place {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.preview-label {
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 0.1em;
}

.preview-main strong {
  max-width: 230px;
  color: var(--text-main);
  font-size: 1.45rem;
  line-height: 1.25;
}

.preview-float {
  position: absolute;
  right: 0;
  bottom: 28px;
  flex-direction: row;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: 14px;
  transform: rotate(3deg);
}

.preview-float strong,
.preview-float small {
  display: block;
}

.preview-float strong {
  color: var(--text-main);
  font-size: 0.9rem;
}

.preview-float small {
  margin-top: 3px;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.avatar-stack {
  display: flex;
  padding-left: 4px;
}

.avatar-stack i {
  display: grid;
  width: 30px;
  height: 30px;
  margin-left: -4px;
  place-items: center;
  color: #fff;
  background: #fc9f7a;
  border: 2px solid #fff;
  border-radius: 50%;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 700;
}

.avatar-stack i:nth-child(2) {
  background: #70b6a5;
}

.avatar-stack i:nth-child(3) {
  background: var(--primary);
}

.art-sparkle {
  position: absolute;
  color: #f2a64a;
}

.sparkle-one {
  top: 38px;
  left: 13%;
  font-size: 2.2rem;
}

.sparkle-two {
  right: 13%;
  top: 23%;
  color: var(--primary);
  font-size: 1.5rem;
}

.features-section {
  padding: 0 var(--space-4);
}

.features-header {
  max-width: 640px;
  margin: 0 auto var(--space-8);
  text-align: center;
}

.features-header h2 {
  margin: var(--space-3) 0;
  color: var(--text-main);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.features-header p,
.feature-card p {
  color: var(--text-muted);
  line-height: 1.7;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-6);
}

.feature-card {
  padding: var(--space-8);
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(28, 25, 72, 0.08);
}

.feature-icon {
  display: grid;
  width: 52px;
  height: 52px;
  margin-bottom: var(--space-6);
  place-items: center;
  border-radius: 16px;
  font-size: 1.8rem;
  font-weight: 700;
}

.icon-discover {
  color: #6644ff;
  background: #f0edff;
}

.icon-ticket {
  color: #1d8b74;
  background: #e8f7f2;
}

.icon-host {
  color: #d0782b;
  background: #fff3e7;
}

.feature-card h3 {
  margin: 0 0 var(--space-2);
  color: var(--text-main);
  font-size: 1.25rem;
  font-weight: 700;
}

.feature-card p {
  margin: 0;
}

@media (max-width: 800px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-8) var(--space-6);
  }

  .hero-art {
    min-height: 300px;
  }

  .orbit-one {
    width: min(70vw, 330px);
  }

  .orbit-two {
    width: min(52vw, 245px);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
