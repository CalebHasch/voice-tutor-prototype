<script setup>
  import { ref } from "vue";
  import { sendTutorMessage } from "@/services/tutorService";

  const selectedTopic = ref("");
  const userInput = ref("");
  const messages = ref([{ role: "system", content: "You are a patient tutor." }]);

  const loading = ref(false);

  async function handleSend() {
    if (!userInput.value) return;

    messages.value.push({ role: "user", content: userInput.value });

    loading.value = true;

    try {
      const reply = await sendTutorMessage(selectedTopic.value, messages.value);
      messages.value.push({ role: "assistant", content: reply });
    } catch {
      messages.value.push({
        role: "assistant",
        content: "Error: Could not reach tutor. Try again.",
      });
    } finally {
      userInput.value = "";
      loading.value = false;
    }
  }
</script>

<template>
  <div class="tutor-chat">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="msg.role">
        <strong>{{ msg.role === "user" ? "You" : "Tutor" }}:</strong>
        {{ msg.content }}
      </div>
    </div>

    <div class="input-area">
      <input
        type="text"
        v-model="userInput"
        @keyup.enter="handleSend"
        placeholder="Type your answer..."
      />
      <button @click="handleSend" :disabled="loading || !selectedTopic">Send</button>
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
  }

  .user {
    text-align: right;
    color: blue;
  }

  .assistant {
    text-align: left;
    color: green;
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
