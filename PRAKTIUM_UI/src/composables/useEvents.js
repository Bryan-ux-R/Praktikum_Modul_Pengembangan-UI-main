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
  },
]

const storageError = ref('')

const loadEvents = () => {
  if (typeof window === 'undefined') {
    return initialEvents.map((event) => ({ ...event }))
  }

  try {
    const savedEvents = window.localStorage.getItem(storageKey)

    if (savedEvents === null) {
      return initialEvents.map((event) => ({ ...event }))
    }

    const parsedEvents = JSON.parse(savedEvents)

    if (
      !Array.isArray(parsedEvents) ||
      parsedEvents.some(
        (event) =>
          !event ||
          (typeof event.id !== 'string' && typeof event.id !== 'number') ||
          typeof event.title !== 'string' ||
          typeof event.date !== 'string' ||
          typeof event.category !== 'string' ||
          typeof event.location !== 'string' ||
          typeof event.description !== 'string',
      )
    ) {
      throw new Error('Saved event data has an invalid format.')
    }

    return parsedEvents.map((event) => ({ ...event, done: Boolean(event.done) }))
  } catch (error) {
    storageError.value =
      error instanceof SyntaxError
        ? 'Saved event data could not be read. Changes may not persist until storage is repaired.'
        : `Local storage could not be read: ${error.message}`

    return initialEvents.map((event) => ({ ...event }))
  }
}

const events = ref(loadEvents())

watch(
  events,
  (updatedEvents) => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(updatedEvents))
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

const addEvent = (eventData) => {
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: eventData.title.trim(),
    category: eventData.category.trim(),
    date: formatEventDate(eventData.date),
    location: eventData.location.trim(),
    description: eventData.description.trim(),
    done: false,
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
    storageError,
    addEvent,
    completeEvent,
    deleteEvent,
    formatEventDate,
  }
}
