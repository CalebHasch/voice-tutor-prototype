import { defineStore } from "pinia";
import { ref } from "vue";
import { getCompetency } from "@/services/db";

const levelsOfCompetency = ["beginner", "intermediate", "advanced", "expert"];

export const useUserStore = defineStore("user", () => {
  // Example user IDs for testing purposes
  const exampleUsers = ref([
    "66cd4faa-3be8-4852-8e83-7e0af6cc20fb",
    "8db49609-1e1b-4a1d-bcc5-6709a84e0761",
    "e8fe5110-675a-469f-a1a4-ee25a9380166",
    "1d180165-ef6e-4d95-bf06-1682e912adbf",
  ]);
  const id = ref(null);
  const name = ref("jeff");
  const competencyLevel = ref(levelsOfCompetency[1]);

  function setUser(data) {
    id.value = data.id;
    name.value = data.name;
  }

  async function setCompetencyLevel(topicId) {
    let topicLevel = "";

    if (!id.value) {
      console.warn("setCompetencyLevel called before user loaded");
      return;
    }

    try {
      const level = await getCompetency(id.value, topicId);

      if (level >= 1 && level <= 3) {
        topicLevel = levelsOfCompetency[0];
      } else if (level >= 4 && level <= 6) {
        topicLevel = levelsOfCompetency[1];
      } else if (level >= 7 && level <= 8) {
        topicLevel = levelsOfCompetency[2];
      } else if (level >= 9 && level <= 10) {
        topicLevel = levelsOfCompetency[3];
      }
    } catch (err) {
      console.error("Error fetching competency:", err);
      competencyLevel.value = levelsOfCompetency[1];
    }

    competencyLevel.value = topicLevel;
  }
  return {
    id,
    name,
    competencyLevel,
    exampleUsers,
    setUser,
    setCompetencyLevel,
  };
});
