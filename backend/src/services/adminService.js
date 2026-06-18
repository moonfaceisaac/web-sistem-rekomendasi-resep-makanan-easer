import { prisma } from "../config/prisma.js";

function buildError(status, message, fieldErrors) {
  const err = new Error(message);
  err.status = status;
  if (fieldErrors) {
    err.fieldErrors = fieldErrors;
  }
  return err;
}

function hasNonEmptyItems(value) {
  return (
    Array.isArray(value) &&
    value.some((item) => String(item || "").trim() !== "")
  );
}

function validateRecipePayload(data) {
  const fieldErrors = {};

  if (!String(data.title || "").trim()) {
    fieldErrors.title = "Recipe title is required";
  }

  if (!hasNonEmptyItems(data.ingredients)) {
    fieldErrors.ingredients =
      "Ingredients must contain at least one non-empty item";
  }

  const steps = data.cookingDirections?.steps;
  if (!hasNonEmptyItems(steps)) {
    fieldErrors.instructions =
      "Instructions must contain at least one non-empty step";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw buildError(400, "Invalid recipe payload", fieldErrors);
  }
}

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
      cookingDirections: true,
      nutritions: true,
      imageUrl: true,
    },
  });

  return {
    recipe,
  };
}

export async function editRecipesAdmin(recipeId, data) {
  validateRecipePayload(data);

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

export async function addRecipeAdmin(data) {
  validateRecipePayload(data);

  return await prisma.recipe.create({
    data: {
      title: data.title,
      ingredients: data.ingredients,
      nutritions: data.nutritions,
      cookingDirections: data.cookingDirections,
    },
  });
}

export async function deleteRecipeAdmin(recipeId) {
  return await prisma.recipe.delete({
    where: {
      recipe_id: Number(recipeId),
    },
  });
}

// export async function deleteUserAdmin(userId) {
//   return await prisma.user.delete({
//     where:{
//       user_id: Number(userId)
//     }
//   })
// }
export async function deleteUserAdmin(userId) {
  const id = Number(userId);

  return await prisma.$transaction(async (tx) => {
    await tx.rating.deleteMany({
      where: {
        user_id: id,
      },
    });

    await tx.bookmark.deleteMany({
      where: {
        user_id: id,
      },
    });

    return await tx.user.delete({
      where: {
        user_id: id,
      },
    });
  });
}