import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: 8,
    name: "Caleb",
    competencyLevel: 7,
  }),

  getters: {
    getUser: (state) => ({
      id: state.id,
      name: state.name,
      competencyLevel: state.competencyLevel,
    }),
  },
});
