import { defineStore } from "pinia";
import { ref } from "vue";

const levelsOfCompetency = ["beginner", "intermediate", "advanced", "expert"];

export const useUserStore = defineStore("user", () => {
  const exampleUsers = ref("8db49609-1e1b-4a1d-bcc5-6709a84e0761");
  const id = ref(null);
  const name = ref("jeff");
  const competencyLevel = ref(levelsOfCompetency[1]);

  function setUser(data) {
    console.log("Setting user data:", data);
    id.value = data.id;
    name.value = data.name;
  }

  function setCompetencyLevel(level) {
    let topicLevel = "";

    if (level >= 1 && level <= 3) {
      topicLevel = levelsOfCompetency[0];
    } else if (level >= 4 && level <= 6) {
      topicLevel = levelsOfCompetency[1];
    } else if (level >= 7 && level <= 8) {
      topicLevel = levelsOfCompetency[2];
    } else if (level >= 9 && level <= 10) {
      topicLevel = levelsOfCompetency[3];
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
