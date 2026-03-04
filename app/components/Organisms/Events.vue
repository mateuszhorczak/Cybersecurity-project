<script setup lang="ts">
const eventStore = useEventStore()
</script>

<template>
  <div
    v-if="eventStore.events.length"
    class="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1"
  >
    <MoleculesEvent
      v-for="event in eventStore.events"
      :id="event.id"
      :key="event.id"
      :name="event.name"
      :description="event.description"
      :type="event.type"
      :date="event.date"
      :date-creation="event.dateCreation"
      :user-id="event.userId"
      class="cursor-pointer"
      @click="$router.push(`/events/${event.id}`)"
    />
  </div>
  <div v-else>
    <AtomsParagraph>Nie znaleziono żadnych wydarzeń.</AtomsParagraph>
  </div>
</template>
