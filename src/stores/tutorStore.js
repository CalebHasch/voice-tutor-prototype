import { defineStore } from "pinia";
import { ref } from "vue";
import { sendTutorMessage } from "@/services/tutorService";
import { useUserStore } from "@/stores/userStore";

export const useTutorStore = defineStore("tutorStore", () => {
  const selectedTopic = ref("");
  const messages = ref([]);
  const loading = ref(false);

  const userStore = useUserStore();
  const { name: username, competencyLevel } = userStore.getUser;

  // Start or restart a new tutoring session
  async function startNewSession(topic) {
    selectedTopic.value = topic;
    messages.value = [];
    const systemPrompt = [{ role: "system", content: "You are a patient tutor." }];

    loading.value = true;
    try {
      const response = await sendTutorMessage(topic, systemPrompt, username, competencyLevel);
      messages.value.push({ role: "assistant", content: response.reply });
    } catch (err) {
      console.error("Error starting tutor session:", err);
      messages.value.push({
        role: "assistant",
        content: "Error: Could not start tutor session.",
      });
    } finally {
      loading.value = false;
    }
  }

  // Send a user message and receive tutor reply
  async function sendUserMessage(userText) {
    if (!userText.trim()) return;

    messages.value.push({ role: "user", content: userText });

    loading.value = true;
    try {
      const response = await sendTutorMessage(
        selectedTopic.value,
        messages.value,
        username,
        competencyLevel
      );
      messages.value.push({ role: "assistant", content: response.reply });
    } catch (err) {
      console.error("Error sending message:", err);
      messages.value.push({
        role: "assistant",
        content: "Error: Could not reach tutor. Try again.",
      });
    } finally {
      loading.value = false;
    }
  }

  return {
    selectedTopic,
    messages,
    loading,
    startNewSession,
    sendUserMessage,
  };
});
