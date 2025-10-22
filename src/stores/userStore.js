import { defineStore } from "pinia";

// For easy testing
const levelsOfCompetency = ["beginner", "intermediate", "advanced", "expert"];

export const useUserStore = defineStore("user", {
  // an example user for demonstration purposes
  state: () => ({
    id: 8,
    name: "Caleb",
    competencyLevel: levelsOfCompetency[3],
  }),

  getters: {
    getUser: (state) => ({
      id: state.id,
      name: state.name,
      competencyLevel: state.competencyLevel,
    }),
  },
});
