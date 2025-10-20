<script setup>
  import { ref, watch } from "vue";
  import { useTutorStore } from "@/stores/tutorStore";
  import { useSpeechRecognition } from "@/composables/useSpeechRecognition";

  const tutorStore = useTutorStore();
  const userInput = ref("");
  const {
    isRecording,
    transcript,
    toggleRecording,
    error: speechError,
  } = useSpeechRecognition(handleSend);

  watch(transcript, (newVal) => {
    userInput.value = newVal || "";
  });

  // Handle user input and next tutor response
  async function handleSend() {
    const message = userInput.value;

    if (typeof message !== "string" || !message.trim()) return;

    await tutorStore.sendUserMessage(message.trim());

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

      <button
        class="mic-btn"
        @click="toggleRecording"
        :disabled="tutorStore.loading"
        :class="{ recording: isRecording }"
        title="Record your answer"
      >
        🎤
      </button>

      <button @click="handleSend" :disabled="tutorStore.loading || !userInput">
        {{ tutorStore.loading ? "..." : "Send" }}
      </button>
    </div>
    <p v-if="speechError" class="error-message">{{ speechError }}</p>
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
    align-items: center;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }

  .mic-btn {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    border: none;
    background-color: #f0f0f0;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .mic-btn:hover {
    background-color: #e0e0e0;
    transform: scale(1.1);
  }

  .mic-btn.recording {
    background-color: #ff5252;
    color: white;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  button {
    padding: 0.55rem 1rem;
    font-size: 1rem;
    border: none;
    background-color: #1e88e5;
    color: white;
    border-radius: 0.5rem;
    cursor: pointer;
    white-space: nowrap;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: #d32f2f; /* Red for errors */
    background-color: #ffebee; /* Light red/pink background */
    border: 1px solid #f44336; /* Slightly darker red border */
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
</style>
