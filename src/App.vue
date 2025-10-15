<script setup>
  import TopicSelector from "@/components/TopicSelector.vue";
  import TutorChat from "@/components/TutorChat.vue";
  import { ref } from "vue";

  const currentTopic = ref("");

  function startSession(topic) {
    currentTopic.value = topic;
  }
</script>

<template>
  <TopicSelector @topic-selected="startSession" />
  <TutorChat v-if="currentTopic" :selectedTopic="currentTopic" />
</template>

<style scoped></style>
