import { data } from "react-router-dom";
import api from "./api";

export async function getRecipes() {
  const res = await api.get("/recipes");
  console.log(data);
  return res.data;
}

export async function getRecipeById(id) {
  const res = await api.get(`/recipes/${id}`);

  return res.data;
}

export async function getRecipesAll(page = 1, limit = 6) {
  const response = await api.get(`/recipes/all?page=${page}&limit=20`);

  return response.data;
}

export async function searchRecipes(keyword, page = 1, limit = 6) {
  const response = await api.get(
    `/recipes/search?keyword=${keyword}&page=${page}&limit=${limit}`,
  );

  return response.data;
}

export async function getRandomRecipes() {
  const response = await api.get("/recipes/random");

  return response.data;
}
