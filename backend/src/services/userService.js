import { prisma } from "../config/prisma.js";

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
  console.log("USER ID:", userId);
  console.log("DATA:", data);
  return await prisma.user.update({
    where: {
      user_id: Number(userId),
    },
    data: {
      namaLengkap: data.payload.namaLengkap,
      tanggalLahir: new Date(data.payload.tanggalLahir),
      username: data.payload.username,
      tempatLahir: data.payload.tempatLahir,
      jenisKelamin: data.payload.jenisKelamin,
      email: data.payload.email,
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
