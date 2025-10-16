<script setup>
  import { getAllTopics } from "@/services/db";
  import { useTutorStore } from "@/stores/tutorStore";
  import { onMounted, ref } from "vue";

  const tutorStore = useTutorStore();

  const topics = ref([]);
  const selectedTopic = ref("");
  const errorMessage = ref(null);
  const loading = ref(true);

  onMounted(async () => {
    try {
      topics.value = await getAllTopics();
    } catch (error) {
      errorMessage.value = error.message;
    } finally {
      loading.value = false;
    }
  });

  function handleStartSession() {
    if (!selectedTopic.value) {
      console.warn("No topic selected.");
      return;
    }

    tutorStore.startNewSession(selectedTopic.value);
  }
</script>

<template>
  <div class="topic-selector">
    <label for="topic">Choose a topic:</label>

    <select id="topic" v-model="selectedTopic" :disabled="loading || !!errorMessage">
      <option value="" disabled>Select a topic</option>
      <option v-for="topic in topics" :key="topic.id" :value="topic.name">
        {{ topic.name }}
      </option>
    </select>

    <button @click="handleStartSession">Start Session</button>

    <p v-if="loading">Loading topics...</p>
    <p v-else-if="errorMessage" style="color: red">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
  .topic-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1rem 0;
  }

  select,
  button {
    padding: 0.5rem;
    font-size: 1rem;
  }
</style>
