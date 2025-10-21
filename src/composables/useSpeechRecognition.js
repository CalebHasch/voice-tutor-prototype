import { ref, onMounted, onBeforeUnmount } from "vue";

export function useSpeechRecognition(handleSend) {
  const isRecording = ref(false);
  const transcript = ref("");
  const error = ref(null);

  let recognition = null;

  onMounted(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        isRecording.value = true;
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          interimTranscript += event.results[i][0].transcript;
        }
        transcript.value = interimTranscript.trim();
      };

      recognition.onerror = (event) => {
        error.value = event.error;
        console.error("Speech recognition error:", event.error);
        stopRecording();
      };

      recognition.onend = async () => {
        if (isRecording.value) {
          isRecording.value = false;

          if (transcript.value.trim()) {
            await handleSend(transcript.value);
            transcript.value = "";
          }
        }
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
      error.value = "Speech recognition not supported";
    }
  });

  onBeforeUnmount(() => {
    if (recognition) recognition.stop();
  });

  // Methods
  function startRecording() {
    if (!recognition || isRecording.value) return;
    try {
      recognition.start();
    } catch (err) {
      error.value = err.message;
      console.error("Error starting speech recognition:", err);
    }
  }

  function stopRecording() {
    if (!recognition || !isRecording.value) return;
    try {
      recognition.stop();
      isRecording.value = false;
    } catch (err) {
      error.value = err.message;
      console.error("Error stopping speech recognition:", err);
    }
  }

  function toggleRecording() {
    if (isRecording.value) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  return {
    isRecording,
    transcript,
    error,
    toggleRecording,
  };
}
