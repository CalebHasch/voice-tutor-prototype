<script setup>
  import { ref } from "vue";
  import { useTutorStore } from "@/stores/tutorStore";

  const tutorStore = useTutorStore();
  const userInput = ref("");

  // Handle user input and next tutor response
  async function handleSend() {
    if (!userInput.value.trim()) return;
    await tutorStore.sendUserMessage(userInput.value);
    userInput.value = "";
  }
</script>

<template>
  <div class="tutor-chat">
    <div class="messages">
      <div v-for="(msg, index) in tutorStore.messages" :key="index" :class="msg.role">
        <strong>{{ msg.role === "user" ? "You" : "Tutor" }}:</strong>
        {{ msg.content }}
      </div>
    </div>

    <div v-if="tutorStore.selectedTopic" class="input-area">
      <input
        type="text"
        v-model="userInput"
        @keyup.enter="handleSend"
        placeholder="Type your answer..."
        :disabled="tutorStore.loading"
      />
      <button @click="handleSend" :disabled="tutorStore.loading || !userInput">
        {{ tutorStore.loading ? "..." : "Send" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .tutor-chat {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .messages {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 0.5rem;
    background: #fafafa;
  }

  .user {
    text-align: right;
    color: #1e88e5;
    margin-bottom: 0.5rem;
  }

  .assistant {
    text-align: left;
    color: #2e7d32;
    margin-bottom: 0.5rem;
  }

  .input-area {
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
  }
</style>
