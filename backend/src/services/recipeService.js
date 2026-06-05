import { prisma } from "../config/prisma.js";

export const findAllRecipes = async () => {
  return prisma.recipe.findMany({
    take: 20,

    select: {
      recipe_id: true,

      title: true,

      imageUrl: true,
    },
  });
};

export async function getAllRecipes(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const recipes = await prisma.recipe.findMany({
    skip,
    take: limit,
    select: {
      recipe_id: true,
      title: true,
      imageUrl: true,
    },
  });

  const totalRecipes = await prisma.recipe.count();

  return {
    recipes,
    totalRecipes,
    totalPages: Math.ceil(totalRecipes / limit),
    currentPage: page,
  };
}


export async function getRecipeById(recipeId) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      recipe_id: Number(recipeId),
    },
  });

  return recipe;
}


export async function searchRecipes(
  keyword,
  page,
  limit
) {
  const skip = (page - 1) * limit;

  const totalRecipes = await prisma.recipe.count({
    where: {
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  });

  const recipes = await prisma.recipe.findMany({
    where: {
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },

    skip,

    take: limit,

    select: {
      recipe_id: true,
      title: true,
      imageUrl: true,
    },
  });

  return {
    recipes,

    currentPage: page,

    totalPages: Math.ceil(totalRecipes / limit),

    totalRecipes,
  };
}

export async function getRecipesAdmin(
  keyword = "",
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;

  const where = {
    title: {
      contains: keyword,
      mode: "insensitive",
    },
  };

  const totalRecipes = await prisma.recipe.count({
    where,
  });

  const recipes = await prisma.recipe.findMany({
    where,

    skip,

    take: limit,

    select: {
      recipe_id: true,
      title: true,
    },
  });

  return {
    recipes,
    currentPage: page,
    totalPages: Math.ceil(totalRecipes / limit),
    totalRecipes,
  };
}

export async function getRandomRecipes(limit = 20) {
  const totalRecipes = await prisma.recipe.count();

  const skip = Math.max(
    0,
    Math.floor(Math.random() * Math.max(totalRecipes - limit, 1))
  );

  const recipes = await prisma.recipe.findMany({
    skip,
    take: limit,
    select: {
      recipe_id: true,
      title: true,
    },
  });

  return recipes;
}