<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  confirmLabel: {
    type: String,
    default: 'Confirm',
  },
  cancelLabel: {
    type: String,
    default: 'Cancel',
  },
  dialogRole: {
    type: String,
    default: 'alertdialog',
    validator: (value) => ['alertdialog', 'dialog'].includes(value),
  },
  iconVariant: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'success'].includes(value),
  },
  confirmDisabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['confirm', 'close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal-overlay" role="presentation" @click.self="$emit('close')">
        <section
          class="confirmation-modal"
          :role="dialogRole"
          aria-modal="true"
          aria-labelledby="confirmation-title"
          :aria-describedby="message ? 'confirmation-message' : undefined"
          tabindex="-1"
          @keydown.esc.prevent.stop="$emit('close')"
        >
          <span class="modal-icon" :class="`modal-icon--${iconVariant}`" aria-hidden="true">
            {{ iconVariant === 'success' ? '✓' : '!' }}
          </span>
          <h2 id="confirmation-title">{{ title }}</h2>
          <p v-if="message" id="confirmation-message">{{ message }}</p>
          <div v-if="$slots.default" class="modal-content">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-actions">
            <slot name="footer" />
          </div>
          <div v-else-if="!$slots.default" class="modal-actions">
            <button
              v-if="cancelLabel"
              type="button"
              class="modal-cancel"
              autofocus
              @click="$emit('close')"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              class="modal-confirm"
              :disabled="confirmDisabled"
              @click="$emit('confirm')"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  overflow-y: auto;
  background: rgba(18, 16, 43, 0.48);
  backdrop-filter: blur(6px);
}

.confirmation-modal {
  width: min(100%, 440px);
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 28px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(28, 25, 72, 0.2);
}

.modal-icon {
  display: grid;
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
  place-items: center;
  color: #b42333;
  background: #fff0f1;
  border-radius: 50%;
  font-size: 1.25rem;
  font-weight: 800;
}

.modal-icon--success {
  color: #24633d;
  background: #e9f7ed;
}

.confirmation-modal h2 {
  margin: 0 0 8px;
  color: var(--text-main);
  font-size: 1.3rem;
}

.confirmation-modal p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.modal-content {
  margin-top: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.modal-actions button {
  min-height: 40px;
  padding: 0 15px;
  border: 1px solid transparent;
  border-radius: 9px;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.modal-cancel {
  color: var(--text-main);
  background: #fff;
  border-color: var(--border-color) !important;
}

.modal-confirm {
  color: #fff;
  background: #b42333;
}

.modal-confirm:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.modal-actions button:focus-visible {
  outline: 3px solid rgba(102, 68, 255, 0.3);
  outline-offset: 2px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
