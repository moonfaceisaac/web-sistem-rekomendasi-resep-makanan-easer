import api from "./api";
import { useAuthStore } from "../store/authStore";

export async function getUserProfile() {
  const response = await api.get(`/user/profile`);

  return response.data;
}

export async function editUserProfile(payload) {
  const response = await api.put(`/user/profile`, payload);
  return response.data;
}

export async function getBookmarks(keyword = "", page = 1, limit = 10) {
  const response = await api.get("/user/bookmarks", {
    params: {
      keyword,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getRatings(keyword = "", page = 1, limit = 10) {
  const response = await api.get("/user/ratings", {
    params: {
      keyword,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getInteractionStatus() {
  const response = await api.get("/user/interaction-status");

  return response.data;
}

export async function createBookmark(recipeId) {
  const response = await api.post("/user/bookmarks", {
    recipeId,
  });
  useAuthStore.getState().markRecommendationDirty();

  return response.data;
}

export async function deleteBookmark(recipeId) {
  const response = await api.delete("/user/bookmarks", {
    data: {
      recipeId,
    },
  });
  useAuthStore.getState().markRecommendationDirty();

  return response.data;
}

export async function createRating({ recipeId, score }) {
  const response = await api.post("/user/rating", { recipeId, score });
  useAuthStore.getState().markRecommendationDirty();

  return response.data;
}

export async function deleteRating(recipeId) {
  const response = await api.delete("/user/rating/", {
    data: {
      recipeId,
    },
  });
  useAuthStore.getState().markRecommendationDirty();

  return response.data;
}

export async function getBookmarkStatus(recipeId) {
  const response = await api.get(`/user/bookmark/${recipeId}`);
  return response.data;
}
