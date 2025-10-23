<script setup>
  import TopicSelector from "@/components/TopicSelector.vue";
  import TutorChat from "@/components/TutorChat.vue";
  import { loadUserData } from "@/services/db";
  import { onMounted } from "vue";
  import { useUserStore } from "@/stores/userStore";

  const userStore = useUserStore();

  onMounted(async () => {
    try {
      // change index for different example users: Brad, Caleb, Alex, Evan
      const userData = await loadUserData(userStore.exampleUsers[2]);
      if (userData) {
        userStore.setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  });
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
