import { prisma } from "../config/prisma.js";
import {
  formatRecipesWithInteraction,
  recipeInteractionSelect,
} from "../helpers/recipeHelper.js";

function buildError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      user_id: Number(userId),
    },
    select: {
      user_id: true,
      namaLengkap: true,
      username: true,
      tanggalLahir: true,
      tempatLahir: true,
      jenisKelamin: true,
      email: true,
      photo: true,
    },
  });
  return user;
  console.log(user);
}

export async function editUserById(userId, data) {
  const payload = data.payload || {};
  const username = String(payload.username || "").trim();
  const email = String(payload.email || "").trim();

  if (!username) {
    throw buildError(400, "Username is required");
  }

  if (!email) {
    throw buildError(400, "Email is required");
  }

  if (!isValidEmail(email)) {
    throw buildError(400, "Invalid email format");
  }

  const existingUsername = await prisma.user.findFirst({
    where: {
      username,
      NOT: {
        user_id: Number(userId),
      },
    },
  });

  if (existingUsername) {
    throw buildError(409, "Username already exists");
  }

  const existingEmail = await prisma.user.findFirst({
    where: {
      email,
      NOT: {
        user_id: Number(userId),
      },
    },
  });

  if (existingEmail) {
    throw buildError(409, "Email already exists");
  }

  return await prisma.user.update({
    where: {
      user_id: Number(userId),
    },
    data: {
      namaLengkap: payload.namaLengkap,
      tanggalLahir: new Date(payload.tanggalLahir),
      username,
      tempatLahir: payload.tempatLahir,
      jenisKelamin: payload.jenisKelamin,
      email,
    },
  });
}

export async function getBookmarks(userId, keyword = "", page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const where = {
    user_id: userId,

    recipe: {
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  };

  const totalBookmarks = await prisma.bookmark.count({
    where,
  });

  const bookmarks = await prisma.bookmark.findMany({
    where,
    skip,
    take: limit,

    select: {
      recipe: {
        select: {
          recipe_id: true,
          title: true,
          imageUrl: true,
        },
      },
    },

    orderBy: {
      recipe_id: "desc",
    },
  });

  return {
    bookmarks,
    currentPage: page,
    totalPages: Math.ceil(totalBookmarks / limit),
    totalBookmarks,
  };
}
export async function getRatings(userId, keyword = "", page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const where = {
    user_id: userId,

    recipe: {
      title: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  };

  const totalRatings = await prisma.rating.count({
    where,
  });

  const ratings = await prisma.rating.findMany({
    where,
    skip,
    take: limit,

    select: {
      score: true,

      recipe: {
        select: {
          recipe_id: true,
          title: true,
        },
      },
    },

    orderBy: {
      recipe_id: "desc",
    },
  });

  return {
    ratings,
    currentPage: page,
    totalPages: Math.ceil(totalRatings / limit),
    totalRatings,
  };
}

export async function getInteractionStatus(userId) {
  const ratingCount = await prisma.rating.count({
    where: {
      user_id: userId,
    },
  });

  const bookmarkCount = await prisma.bookmark.count({
    where: {
      user_id: userId,
    },
  });

  return {
    hasInteraction: ratingCount > 0 || bookmarkCount > 0,
  };
}

export async function createBookmark(userId, recipeId) {
  const existing = await prisma.bookmark.findFirst({
    where: {
      user_id: userId,
      recipe_id: Number(recipeId),
    },
  });

  if (existing) {
    throw new Error("Recipe already bookmarked");
  }

  return await prisma.bookmark.create({
    data: {
      user_id: userId,
      recipe_id: Number(recipeId),
    },
  });
}

export async function deleteBookmark(userId, recipeId) {
  const existing = await prisma.bookmark.findFirst({
    where: {
      user_id: userId,
      recipe_id: Number(recipeId),
    },
  });

  if (existing) {
    return await prisma.bookmark.delete({
      where: {
        bookmark_id: existing.bookmark_id,
      },
    });
  }
  throw new Error("Recipe is not bookmarked");
}

export async function createRating(userId, recipeId, score) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: Number(recipeId),
    },
  });
  if (!recipe) {
    throw Error("Recipe is not found");
  }
  const existing = await prisma.rating.findFirst({
    where: {
      recipe_id: Number(recipeId),
      user_id: Number(userId),
    },
  });
  if (existing) {
    return await prisma.rating.update({
      where: {
        rating_id: existing.rating_id,
      },
      data: {
        score: Number(score),
      },
    });
  }
  return await prisma.rating.create({
    data: {
      recipe_id: Number(recipeId),
      user_id: Number(userId),
      score: Number(score),
    },
  });
}

export async function deleteRating(userId, recipeId) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: Number(recipeId),
    },
  });
  if (!recipe) {
    throw Error("Recipe is not found");
  }
  const existing = await prisma.rating.findFirst({
    where: {
      recipe_id: Number(recipeId),
      user_id: Number(userId),
    },
  });
  if (existing) {
    return await prisma.rating.delete({
      where: {
        rating_id: existing.rating_id,
      },
    });
  }
  throw Error("Recipe is not rated");
}
