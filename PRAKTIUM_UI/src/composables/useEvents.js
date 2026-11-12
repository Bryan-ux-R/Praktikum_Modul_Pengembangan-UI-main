import { computed, ref, watch } from 'vue'

const storageKey = 'gatherly-events'
const apiBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '') || ''
const pendingRequests = ref(0)
const loading = computed(() => pendingRequests.value > 0)
const error = ref('')
let eventsRequest

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

const getEventsEndpoint = () => {
  if (!apiBaseUrl) {
    throw new Error(
      'MockAPI is not configured. Add VITE_API_URL to the .env file and restart Vite.',
    )
  }

  return apiBaseUrl.endsWith('/events') ? apiBaseUrl : `${apiBaseUrl}/events`
}

const readResponseBody = async (response) => {
  const body = await response.text()

  if (!body) {
    return null
  }

  try {
    return JSON.parse(body)
  } catch (parseError) {
    if (parseError instanceof SyntaxError) {
      return body
    }

    throw parseError
  }
}

const ensureResponseOk = (response, body, operation) => {
  if (response.ok) {
    return
  }

  const detail =
    body && typeof body === 'object' && typeof body.message === 'string' ? `: ${body.message}` : ''
  throw new Error(`${operation} failed (HTTP ${response.status})${detail}`)
}

const withApiRequest = async (request) => {
  pendingRequests.value += 1
  error.value = ''

  try {
    return await request()
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : 'The API request failed.'
    throw requestError
  } finally {
    pendingRequests.value -= 1
  }
}

const normalizeApiEvent = (data) => {
  const category = data?.cat ?? data?.category
  const location = data?.loc ?? data?.location
  const description = data?.desc ?? data?.description

  if (
    !data ||
    typeof data !== 'object' ||
    (typeof data.id !== 'string' && typeof data.id !== 'number') ||
    typeof data.title !== 'string' ||
    !data.title.trim() ||
    typeof data.date !== 'string' ||
    !data.date.trim() ||
    typeof category !== 'string' ||
    typeof location !== 'string' ||
    typeof description !== 'string' ||
    ![true, false, 'true', 'false'].includes(data.done)
  ) {
    throw new Error('The server returned an event with an invalid format.')
  }

  const quota = Number(data.quota ?? data.remainingSeats)

  if (!Number.isFinite(quota) || quota < 0) {
    throw new Error(`The server returned an invalid quota for event "${data.title}".`)
  }

  const registeredCount = userRegistrations.value.filter(
    (registration) => String(registration.eventId) === String(data.id),
  ).length
  const cachedEvent = events.value.find((event) => String(event.id) === String(data.id))

  return {
    id: data.id,
    title: data.title,
    category,
    date: data.date,
    location,
    description,
    done: data.done === true || data.done === 'true' || Boolean(cachedEvent?.done),
    remainingSeats: Math.max(0, quota - registeredCount),
  }
}

const eventToApiData = (eventData) => ({
  title: eventData.title.trim(),
  cat: eventData.category.trim(),
  date: eventData.date,
  loc: eventData.location.trim(),
  quota: 30,
  desc: eventData.description.trim(),
  done: false,
})

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

const fetchEvents = () => {
  if (eventsRequest) {
    return eventsRequest
  }

  eventsRequest = withApiRequest(async () => {
    const response = await fetch(getEventsEndpoint(), {
      headers: { Accept: 'application/json' },
    })
    const body = await readResponseBody(response)
    ensureResponseOk(response, body, 'Loading events')

    if (!Array.isArray(body)) {
      throw new Error('The server returned an invalid event list.')
    }

    events.value = body.map(normalizeApiEvent)
    return events.value
  }).finally(() => {
    eventsRequest = undefined
  })

  return eventsRequest
}

const fetchEventById = (eventId) =>
  withApiRequest(async () => {
    const response = await fetch(`${getEventsEndpoint()}/${encodeURIComponent(String(eventId))}`, {
      headers: { Accept: 'application/json' },
    })

    if (response.status === 404) {
      const eventIndex = events.value.findIndex((item) => String(item.id) === String(eventId))

      if (eventIndex !== -1) {
        events.value.splice(eventIndex, 1)
      }

      error.value = 'This event could not be found or has been removed.'
      return null
    }

    const body = await readResponseBody(response)
    ensureResponseOk(response, body, 'Loading event')
    if (String(body?.id) !== String(eventId)) {
      throw new Error('The server returned a different event than the one requested.')
    }

    const event = normalizeApiEvent(body)
    const eventIndex = events.value.findIndex((item) => String(item.id) === String(event.id))

    if (eventIndex === -1) {
      events.value.unshift(event)
    } else {
      events.value.splice(eventIndex, 1, event)
    }

    return event
  })

const createEvent = (eventData) =>
  withApiRequest(async () => {
    const response = await fetch(getEventsEndpoint(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventToApiData(eventData)),
    })
    const body = await readResponseBody(response)
    ensureResponseOk(response, body, 'Creating event')

    const event = normalizeApiEvent(body)
    events.value.unshift(event)
    return event
  })

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

const deleteEvent = (eventId) =>
  withApiRequest(async () => {
    const eventIndex = events.value.findIndex((event) => String(event.id) === String(eventId))

    if (eventIndex === -1) {
      return false
    }

    const response = await fetch(`${getEventsEndpoint()}/${encodeURIComponent(String(eventId))}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      const body = await readResponseBody(response)
      ensureResponseOk(response, body, 'Deleting event')
    }

    events.value.splice(eventIndex, 1)
    userRegistrations.value = userRegistrations.value.filter(
      (registration) => String(registration.eventId) !== String(eventId),
    )
    return true
  })

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
    loading,
    error,
    isUserRegistered,
    getRegistrationForEvent,
    getRegistrationById,
    isEventDone,
    addEvent,
    fetchEvents,
    fetchEventById,
    createEvent,
    completeEvent,
    deleteEvent,
    registerAttendee,
    cancelRegistration,
    formatEventDate,
  }
}
