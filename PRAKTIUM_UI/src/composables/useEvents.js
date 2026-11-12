import { computed, ref, watch } from 'vue'

const storageKey = 'gatherly-events'

const initialEvents = [
  {
    id: 1,
    date: '12 Oct 2026',
    category: 'Workshop & Training',
    title: 'Vue.js Mastery Workshop',
    location: 'Tech Hub, Jakarta Pusat',
    description:
      'Level up your frontend skills with hands-on Vue 3, Composition API, and practical project sessions.',
    done: false,
    remainingSeats: 12,
  },
  {
    id: 2,
    date: '15 Oct 2026',
    category: 'Technology',
    title: 'Jakarta Design Systems Meetup',
    location: 'M Bloc Space, Jakarta Selatan',
    description:
      'Meet local product teams and learn how thoughtful design systems help teams build better products.',
    done: false,
    remainingSeats: 36,
  },
  {
    id: 3,
    date: '18 Oct 2026',
    category: 'Community',
    title: 'Creative Founders Connect',
    location: 'Taman Ismail Marzuki, Jakarta Pusat',
    description:
      'An evening to share ideas, connect with creative founders, and find your next collaborator.',
    done: false,
    remainingSeats: 38,
  },
  {
    id: 4,
    date: '22 Oct 2026',
    category: 'Workshop & Training',
    title: 'Product Discovery Sprint',
    location: 'GoWork, Jakarta Selatan',
    description:
      'Practice research and rapid prototyping techniques for turning user needs into useful products.',
    done: false,
    remainingSeats: 24,
  },
  {
    id: 5,
    date: '25 Oct 2026',
    category: 'Technology',
    title: 'Frontend Performance Lab',
    location: 'Tech Hub, Jakarta Pusat',
    description:
      'Explore practical ways to make modern web applications feel faster and work better for everyone.',
    done: false,
    remainingSeats: 42,
  },
  {
    id: 6,
    date: '29 Oct 2026',
    category: 'Community',
    title: 'Jakarta Makers Social',
    location: 'M Bloc Space, Jakarta Selatan',
    description:
      'Share what you are building, get useful feedback, and meet the people shaping the local tech scene.',
    done: false,
    remainingSeats: 31,
  },
]

const storageError = ref('')

const normalizeEvents = (savedEvents) =>
  savedEvents.map((event) => ({
    ...event,
    done: Boolean(event.done),
    remainingSeats:
      Number.isInteger(event.remainingSeats) && event.remainingSeats >= 0
        ? event.remainingSeats
        : 12,
  }))

const loadState = () => {
  if (typeof window === 'undefined') {
    return {
      events: normalizeEvents(initialEvents),
      registrations: [],
    }
  }

  try {
    const savedEvents = window.localStorage.getItem(storageKey)

    if (savedEvents === null) {
      return {
        events: normalizeEvents(initialEvents),
        registrations: [],
      }
    }

    const parsedEvents = JSON.parse(savedEvents)
    const savedState = Array.isArray(parsedEvents)
      ? { events: parsedEvents, registrations: [] }
      : parsedEvents

    if (
      !savedState ||
      !Array.isArray(savedState.events) ||
      !Array.isArray(savedState.registrations) ||
      savedState.events.some(
        (event) =>
          !event ||
          (typeof event.id !== 'string' && typeof event.id !== 'number') ||
          typeof event.title !== 'string' ||
          typeof event.date !== 'string' ||
          typeof event.category !== 'string' ||
          typeof event.location !== 'string' ||
          typeof event.description !== 'string',
      ) ||
      savedState.registrations.some(
        (registration) =>
          !registration ||
          typeof registration.id !== 'string' ||
          (typeof registration.eventId !== 'string' && typeof registration.eventId !== 'number') ||
          typeof registration.name !== 'string' ||
          typeof registration.email !== 'string',
      )
    ) {
      throw new Error('Saved event data has an invalid format.')
    }

    const eventIds = new Set(savedState.events.map((event) => String(event.id)))
    const registrations = savedState.registrations.filter((registration) =>
      eventIds.has(String(registration.eventId)),
    )

    return {
      events: normalizeEvents(savedState.events),
      registrations,
    }
  } catch (error) {
    storageError.value =
      error instanceof SyntaxError
        ? 'Saved event data could not be read. Changes may not persist until storage is repaired.'
        : `Local storage could not be read: ${error.message}`

    return {
      events: normalizeEvents(initialEvents),
      registrations: [],
    }
  }
}

const initialState = loadState()
const events = ref(initialState.events)
const userRegistrations = ref(initialState.registrations)

watch(
  [events, userRegistrations],
  ([updatedEvents, updatedRegistrations]) => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ events: updatedEvents, registrations: updatedRegistrations }),
      )
      storageError.value = ''
    } catch (error) {
      storageError.value = `Changes could not be saved to local storage: ${error.message}`
    }
  },
  { deep: true },
)

const totalEvents = computed(() => events.value.length)
const activeEvents = computed(() => events.value.filter((event) => !event.done))
const completedEvents = computed(() => events.value.filter((event) => event.done))
const categories = computed(() => [
  ...new Set(activeEvents.value.map((event) => event.category).filter(Boolean)),
])

const isUserRegistered = (eventId) =>
  userRegistrations.value.some((registration) => String(registration.eventId) === String(eventId))

const getRegistrationForEvent = (eventId) =>
  userRegistrations.value.find((registration) => String(registration.eventId) === String(eventId))

const getRegistrationById = (registrationId) =>
  userRegistrations.value.find((registration) => registration.id === registrationId)

const isEventDone = (eventId) =>
  Boolean(events.value.find((event) => String(event.id) === String(eventId))?.done)

const createRegistrationId = () => {
  let id

  do {
    const randomPart =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID().replaceAll('-', '').slice(0, 10)
        : Math.random().toString(36).slice(2, 12).toUpperCase()
    id = `GTH-${Date.now().toString(36).toUpperCase()}-${randomPart.toUpperCase()}`
  } while (userRegistrations.value.some((registration) => registration.id === id))

  return id
}

const registerAttendee = (eventId, attendee) => {
  const event = events.value.find((item) => String(item.id) === String(eventId))

  if (!event) {
    return { error: 'This event could not be found.' }
  }

  if (event.done) {
    return { error: 'Registration for this event is closed.' }
  }

  if (isUserRegistered(eventId)) {
    return { error: 'You are already registered for this event.' }
  }

  if (event.remainingSeats <= 0) {
    return { error: 'This event is sold out.' }
  }

  const registration = {
    ...attendee,
    id: createRegistrationId(),
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventLocation: event.location,
    createdAt: new Date().toISOString(),
  }

  event.remainingSeats -= 1
  userRegistrations.value.unshift(registration)

  return { registration }
}

const cancelRegistration = (registrationId) => {
  const registrationIndex = userRegistrations.value.findIndex(
    (registration) => registration.id === registrationId,
  )

  if (registrationIndex === -1) {
    return false
  }

  const registration = userRegistrations.value[registrationIndex]
  const event = events.value.find((item) => String(item.id) === String(registration.eventId))

  if (!event || event.done) {
    return false
  }

  event.remainingSeats += 1
  userRegistrations.value.splice(registrationIndex, 1)
  return true
}

const addEvent = (eventData) => {
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: eventData.title.trim(),
    category: eventData.category.trim(),
    date: formatEventDate(eventData.date),
    location: eventData.location.trim(),
    description: eventData.description.trim(),
    done: false,
    remainingSeats: 30,
  }

  events.value.unshift(event)
  return event
}

const completeEvent = (eventId) => {
  const event = events.value.find((item) => String(item.id) === String(eventId))

  if (!event || event.done) {
    return false
  }

  event.done = true
  return true
}

const deleteEvent = (eventId) => {
  const eventIndex = events.value.findIndex((event) => String(event.id) === String(eventId))

  if (eventIndex === -1) {
    return false
  }

  events.value.splice(eventIndex, 1)
  userRegistrations.value = userRegistrations.value.filter(
    (registration) => String(registration.eventId) !== String(eventId),
  )
  return true
}

const formatEventDate = (date) => {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

export function useEvents() {
  return {
    events,
    totalEvents,
    activeEvents,
    completedEvents,
    categories,
    userRegistrations,
    storageError,
    isUserRegistered,
    getRegistrationForEvent,
    getRegistrationById,
    isEventDone,
    addEvent,
    completeEvent,
    deleteEvent,
    registerAttendee,
    cancelRegistration,
    formatEventDate,
  }
}
