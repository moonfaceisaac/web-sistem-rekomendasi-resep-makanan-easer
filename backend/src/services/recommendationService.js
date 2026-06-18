import { prisma } from "../config/prisma.js";
import axios from "axios";

export async function getRecommendations(recipeIds) {
  const response = await axios.post(process.env.RECOMMENDATION_URL, {
    recipe_ids: recipeIds,
    top_k: 30,
  });

  const recommendedIds = response.data.recipe_ids;
  const recipes = await prisma.recipe.findMany({
    where: {
      recipe_id: {
        in: recommendedIds,
      },
    },
  });
  const orderedRecipes = recommendedIds
    .map((id) => recipes.find((r) => r.recipe_id === id))
    .filter(Boolean);

  return orderedRecipes;
}
export async function getUserInteractions(userId) {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      user_id: userId,
    },
    select: {
      recipe_id: true,
    },
  });

  const ratings = await prisma.rating.findMany({
    where: {
      user_id: userId,
    },
    select: {
      recipe_id: true,
    },
  });

  return [
    ...new Set([
      ...bookmarks.map((b) => b.recipe_id),
      ...ratings.map((r) => r.recipe_id),
    ]),
  ];
}
