import api from "./api";

export async function getRecommendations() {
  const response = await api.get("/rec/recipes");

  return response.data;
}