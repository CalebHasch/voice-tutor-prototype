<script setup>
  import { ref, watch } from "vue";
  import { sendTutorMessage } from "@/services/tutorService";

  // Props — selectedTopic will come from parent (e.g. TopicSelector)
  const props = defineProps({
    selectedTopic: {
      type: String,
      default: "",
    },
  });

  const messages = ref([]);
  const userInput = ref("");
  const loading = ref(false);
  const initialized = ref(false);

  // Watch for topic change → reset chat and start new session
  watch(
    () => props.selectedTopic,
    async (newTopic) => {
      if (!newTopic) return;
      messages.value = [{ role: "system", content: "You are a patient tutor." }];
      initialized.value = false;
      await startTutorSession(newTopic);
    }
  );

  // Fetch initial tutor message for topic
  async function startTutorSession(topic) {
    loading.value = true;
    try {
      const response = await sendTutorMessage(topic, messages.value);
      messages.value.push({ role: "assistant", content: response.reply });
      initialized.value = true;
    } catch (error) {
      console.error("Error starting tutor session:", error);
      messages.value.push({
        role: "assistant",
        content: "Error: Could not reach tutor. Try again later.",
      });
    } finally {
      loading.value = false;
    }
  }

  // Handle user input and next tutor response
  async function handleSend() {
    if (!userInput.value || loading.value) return;

    messages.value.push({ role: "user", content: userInput.value });

    loading.value = true;
    const topic = props.selectedTopic;

    try {
      const response = await sendTutorMessage(topic, messages.value);
      messages.value.push({ role: "assistant", content: response.reply });
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

    <div v-if="props.selectedTopic" class="input-area">
      <input
        type="text"
        v-model="userInput"
        @keyup.enter="handleSend"
        placeholder="Type your answer..."
        :disabled="loading"
      />
      <button @click="handleSend" :disabled="loading || !userInput">
        {{ loading ? "..." : "Send" }}
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
