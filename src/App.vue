<script setup>
  import TopicSelector from "@/components/TopicSelector.vue";
  import TutorChat from "@/components/TutorChat.vue";
</script>

<template>
  <main>
    <h1>Voice-Based Tutor</h1>

    <TopicSelector />
    <TutorChat />
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
