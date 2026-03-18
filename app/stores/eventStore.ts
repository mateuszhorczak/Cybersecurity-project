export const useEventStore = defineStore('eventStore', () => {
  const events = ref<FullEvent[]>([])
  const singleEvent = ref<FullEvent>()
  const authStore = useAuthStore()

  const clearEventsList = () => {
    events.value.length = 0
  }

  const addEvent = async (event: NewEvent) => {
    try {
      await $fetch('/api/events', {
        headers: { authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: {
          ...event,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const updateEvent = async (event: FullEvent) => {
    try {
      await $fetch(`/api/events/${event.id}`, {
        headers: { authorization: `Bearer ${authStore.token}` },
        method: 'PUT',
        body: event,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteEvent = async (id: number) => {
    try {
      await $fetch(`/api/events/${id}`, {
        headers: { authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getEventPdf = async (month: number, year: number) => {
    try {
      const { data } = await useFetch('/api/events/pdf', {
        headers: { authorization: `Bearer ${authStore.token}` },
        method: 'GET',
        query: { month, year },
      })
      const blob = data.value
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getEventsByDate = async (dateString: string) => {
    try {
      const { data } = await useAsyncData(`events-date-${dateString}`, () =>
        $fetch('/api/events/by-date', {
          headers: { authorization: `Bearer ${authStore.token}` },
          method: 'GET',
          query: { date: dateString },
        }),
      )

      // @ts-expect-error .................
      events.value = data.value?.data || null
    } catch (error) {
      console.error(error)
    }
  }

  const getEventsByName = async (name: string) => {
    try {
      const { data } = await useAsyncData(`events-name-${name}`, () =>
        $fetch('/api/events/by-name', {
          headers: { authorization: `Bearer ${authStore.token}` },
          method: 'GET',
          query: { name },
        }),
      )

      // @ts-expect-error .................
      events.value = data.value?.data || null
    } catch (error) {
      console.error(error)
    }
  }

  const getEventsByWeek = async (week: number, year: number) => {
    try {
      const { data } = await useAsyncData(
        `events-week-${week}-year-${year}`,
        () =>
          $fetch('/api/events/by-week', {
            headers: { authorization: `Bearer ${authStore.token}` },
            method: 'GET',
            query: { week, year },
          }),
      )

      // Wyswietlenie przykladowych links
      // const rawData = JSON.parse(JSON.stringify(data.value))
      // console.log('Odebrane dane:', rawData)

      // @ts-expect-error .................
      events.value = data.value?.data || null
    } catch (error) {
      console.error(error)
    }
  }

  const getEventById = async (id: number) => {
    try {
      const { data } = await useFetch(`/api/events/${id}`, {
        headers: { authorization: `Bearer ${authStore.token}` },
        method: 'GET',
        query: { id },
      })

      // @ts-expect-error .................
      singleEvent.value = data.value?.data || null
    } catch (error) {
      console.error(error)
    }
  }

  return {
    events,
    singleEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventPdf,
    getEventsByDate,
    getEventsByName,
    getEventsByWeek,
    clearEventsList,
    getEventById,
  }
})
