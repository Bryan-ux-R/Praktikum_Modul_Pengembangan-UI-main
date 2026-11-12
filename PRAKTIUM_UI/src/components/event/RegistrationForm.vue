<script setup>
import { computed, reactive, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  reason: '',
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  reason: '',
})

const hasSubmitted = ref(false)
const showDiscardDialog = ref(false)
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
  now.getDate(),
).padStart(2, '0')}`
const isFormDirty = computed(() => Object.values(form).some((value) => value.trim()))

const validateField = (field) => {
  const value = form[field].trim()

  if (field === 'name') {
    errors.name = value.length < 2 ? 'Enter your full name (at least 2 characters).' : ''
  } else if (field === 'email') {
    errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.'
  } else if (field === 'phone') {
    const digits = value.replace(/\D/g, '')
    errors.phone =
      /^\+?[0-9\s()-]+$/.test(value) && digits.length >= 8 && digits.length <= 15
        ? ''
        : 'Enter a valid phone number with 8 to 15 digits.'
  } else if (field === 'dateOfBirth') {
    errors.dateOfBirth =
      value && value <= today ? '' : 'Enter a valid date of birth that is not in the future.'
  } else if (field === 'reason') {
    errors.reason =
      value.length >= 20 ? '' : 'Tell us why you want to attend (at least 20 characters).'
  }

  return !errors[field]
}

const validateForm = () => {
  hasSubmitted.value = true
  const valid = Object.keys(form).map(validateField).every(Boolean)

  if (!valid) {
    const firstInvalidField = Object.keys(errors).find((field) => errors[field])
    document.getElementById(`registration-${firstInvalidField}`)?.focus()
  }

  return valid
}

const submitForm = () => {
  if (!validateForm()) {
    return
  }

  emit('submit', { ...form, name: form.name.trim(), email: form.email.trim() })
}

const requestCancel = () => {
  if (isFormDirty.value) {
    showDiscardDialog.value = true
    return
  }

  emit('cancel')
}

const discardForm = () => {
  showDiscardDialog.value = false
  emit('cancel')
}
</script>

<template>
  <section class="registration-form-panel">
    <header class="form-header">
      <span class="form-eyebrow">ATTENDEE DETAILS</span>
      <h2>Complete your registration</h2>
      <p>Your ticket details will be saved in this browser.</p>
    </header>

    <form class="registration-form" novalidate @submit.prevent="submitForm">
      <label class="form-field" :class="{ invalid: errors.name }" for="registration-name">
        <span>Full name <span class="required-mark">*</span></span>
        <input
          id="registration-name"
          v-model="form.name"
          autocomplete="name"
          type="text"
          maxlength="100"
          placeholder="Your full name"
          :aria-invalid="Boolean(errors.name)"
          :aria-describedby="errors.name ? 'registration-name-error' : undefined"
          @blur="hasSubmitted && validateField('name')"
          @input="hasSubmitted && validateField('name')"
        />
        <small v-if="errors.name" id="registration-name-error" class="field-error" role="alert">
          {{ errors.name }}
        </small>
      </label>

      <label class="form-field" :class="{ invalid: errors.email }" for="registration-email">
        <span>Email address <span class="required-mark">*</span></span>
        <input
          id="registration-email"
          v-model="form.email"
          autocomplete="email"
          type="email"
          maxlength="254"
          placeholder="you@example.com"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="errors.email ? 'registration-email-error' : undefined"
          @blur="hasSubmitted && validateField('email')"
          @input="hasSubmitted && validateField('email')"
        />
        <small v-if="errors.email" id="registration-email-error" class="field-error" role="alert">
          {{ errors.email }}
        </small>
      </label>

      <label class="form-field" :class="{ invalid: errors.phone }" for="registration-phone">
        <span>Phone number <span class="required-mark">*</span></span>
        <input
          id="registration-phone"
          v-model="form.phone"
          autocomplete="tel"
          inputmode="tel"
          type="tel"
          maxlength="24"
          placeholder="+62 812 3456 7890"
          :aria-invalid="Boolean(errors.phone)"
          :aria-describedby="errors.phone ? 'registration-phone-error' : undefined"
          @blur="hasSubmitted && validateField('phone')"
          @input="hasSubmitted && validateField('phone')"
        />
        <small v-if="errors.phone" id="registration-phone-error" class="field-error" role="alert">
          {{ errors.phone }}
        </small>
      </label>

      <label
        class="form-field"
        :class="{ invalid: errors.dateOfBirth }"
        for="registration-date-of-birth"
      >
        <span>Date of birth <span class="required-mark">*</span></span>
        <input
          id="registration-date-of-birth"
          v-model="form.dateOfBirth"
          autocomplete="bday"
          type="date"
          :max="today"
          :aria-invalid="Boolean(errors.dateOfBirth)"
          :aria-describedby="errors.dateOfBirth ? 'registration-date-error' : undefined"
          @blur="hasSubmitted && validateField('dateOfBirth')"
          @change="hasSubmitted && validateField('dateOfBirth')"
        />
        <small
          v-if="errors.dateOfBirth"
          id="registration-date-error"
          class="field-error"
          role="alert"
        >
          {{ errors.dateOfBirth }}
        </small>
      </label>

      <label
        class="form-field form-field-wide"
        :class="{ invalid: errors.reason }"
        for="registration-reason"
      >
        <span>Why do you want to attend? <span class="required-mark">*</span></span>
        <textarea
          id="registration-reason"
          v-model="form.reason"
          rows="4"
          maxlength="500"
          placeholder="Share what you hope to learn or experience (at least 20 characters)."
          :aria-invalid="Boolean(errors.reason)"
          :aria-describedby="errors.reason ? 'registration-reason-error' : undefined"
          @blur="hasSubmitted && validateField('reason')"
          @input="hasSubmitted && validateField('reason')"
        ></textarea>
        <small class="character-count">{{ form.reason.trim().length }}/500 characters</small>
        <small v-if="errors.reason" id="registration-reason-error" class="field-error" role="alert">
          {{ errors.reason }}
        </small>
      </label>

      <div class="form-actions">
        <AppButton variant="secondary" @click="requestCancel">Cancel</AppButton>
        <AppButton type="submit">Continue to Confirmation</AppButton>
      </div>
    </form>

    <AppModal
      v-if="showDiscardDialog"
      title="Discard your registration?"
      message="Your details have not been saved. Leave this form and discard what you entered?"
      confirm-label="Discard details"
      @confirm="discardForm"
      @close="showDiscardDialog = false"
    />
  </section>
</template>

<style scoped>
.registration-form-panel {
  min-width: 0;
  padding: clamp(20px, 4vw, 32px);
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(28, 25, 72, 0.035);
}

.form-header {
  margin-bottom: 24px;
}

.form-eyebrow {
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.form-header h2 {
  margin: 7px 0;
  color: var(--text-main);
  font-size: clamp(1.35rem, 3vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.035em;
}

.form-header p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.5;
}

.registration-form,
.form-field {
  display: grid;
}

.registration-form {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-field {
  min-width: 0;
  align-content: start;
  gap: 7px;
  color: var(--text-main);
  font-size: 0.88rem;
  font-weight: 650;
}

.form-field-wide {
  grid-column: 1 / -1;
}

.required-mark {
  color: #b42333;
}

.form-field input,
.form-field textarea {
  width: 100%;
  min-width: 0;
  padding: 11px 12px;
  color: var(--text-main);
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  font: inherit;
  font-weight: 400;
}

.form-field textarea {
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  border-color: var(--primary);
  outline: 3px solid rgba(102, 68, 255, 0.12);
}

.form-field.invalid input,
.form-field.invalid textarea {
  border-color: #b42333;
}

.form-field.invalid input:focus,
.form-field.invalid textarea:focus {
  outline-color: rgba(180, 35, 51, 0.13);
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: #92919c;
}

.field-error {
  color: #a12533;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.45;
}

.character-count {
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 400;
  text-align: right;
}

.form-actions {
  display: flex;
  grid-column: 1 / -1;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 640px) {
  .registration-form {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-field-wide,
  .form-actions {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions :deep(button) {
    width: 100%;
  }
}
</style>
