<script setup>
  import TopicSelector from "@/components/TopicSelector.vue";
  import TutorChat from "@/components/TutorChat.vue";
  import { ref } from "vue";

  const tutorChatRef = ref(null);

  function handleStartSession(topic) {
    if (tutorChatRef.value) {
      tutorChatRef.value.startNewSession(topic);
    }
  }
</script>

<template>
  <main>
    <h1>Voice-Based Tutor</h1>
    <p>Select a topic and start a tutoring session.</p>

    <TopicSelector @start-session="handleStartSession" />

    <TutorChat ref="tutorChatRef" />
  </main>
</template>

<style scoped>
  main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
<style scoped></style>
