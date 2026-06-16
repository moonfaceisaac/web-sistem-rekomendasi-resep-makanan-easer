import api from "./api";

export async function getUsers(keyword = "", page = 1, limit = 10) {
  const response = await api.get(
    `/admin/users?keyword=${keyword}&page=${page}&limit=${limit}`,
  );

  return response.data;
}

export async function getRecipes(keyword = "", page = 1, limit = 10) {
  //   const response = await api.get(`/admin/recipes?keyword=${keyword}`);
  const response = await api.get(
    `/admin/recipes?query=${keyword}&page=${page}&limit=${limit}`,
  );

  return response.data;
}

export async function updateRecipe(recipeId, data) {
  const response = await api.put(`/admin/recipes/${recipeId}`, data);

  return response.data;
}

export async function deleteRecipe(recipeId) {
  const response = await api.delete(`/admin/recipes/${recipeId}`);

  return response.data;
}

export async function getRecipeDetail(recipeId) {
  const response = await api.get(`/admin/recipesdetail/${recipeId}`);

  return response.data;
}

export async function createRecipe(recipeData) {
  const response = await api.post(
    "/admin/recipes",
    recipeData,
  );

  return response.data;
}
