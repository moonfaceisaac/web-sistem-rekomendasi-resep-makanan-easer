import { prisma } from "../config/prisma.js";

export async function getUsers(keyword = "", page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      {
        namaLengkap: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    ],
  };

  const totalUsers = await prisma.user.count({
    where,
  });

  const users = await prisma.user.findMany({
    where,

    skip,

    take: limit,

    select: {
      user_id: true,
      namaLengkap: true,
      email: true,
    },
  });

  return {
    users,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
  };
}

export async function getRecipesAdmin(keyword = "", page = 1, limit = 10) {
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

export async function getRecipeAdminDetail(recipeId) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      recipe_id: Number(recipeId),
    },

    select: {
      recipe_id: true,
      title: true,
      ingredients: true,
      cookingDirections:true,
      nutritions:true,
      imageUrl:true
    },
  });

  return {
    recipe,
  };
}

export async function editRecipesAdmin(recipeId, data) {
  return await prisma.recipe.update({
    where: {
      recipe_id: Number(recipeId),
    },
    data: {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      nutritions: data.nutritions,
      cookingDirections: data.cookingDirections,
    },
  });
}

export async function addRecipeAdmin(data){
  return await prisma.recipe.create({
    data:{
      title:data.title,
      ingredients:data.ingredients,
      nutritions:data.nutritions,
      cookingDirections:data.cookingDirections,
    }
  })
}

export async function deleteRecipeAdmin(recipeId) {
  return await prisma.recipe.delete({
    where: {
      recipe_id: Number(recipeId),
    },
  });
}
