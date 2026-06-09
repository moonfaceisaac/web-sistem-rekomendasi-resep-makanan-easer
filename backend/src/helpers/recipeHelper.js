export function formatRecipesWithInteraction(recipes) {
  return recipes.map((recipe) => ({
    recipe_id: recipe.recipe_id,
    title: recipe.title,
    imageUrl: recipe.imageUrl,

    isBookmarked: recipe.bookmarks.length > 0,

    bookmarkId: recipe.bookmarks[0]?.bookmark_id ?? null,

    userRating:
      recipe.ratings.length > 0
        ? recipe.ratings[0].score
        : null,
  }));
}

export function recipeInteractionSelect(userId) {
  return {
    recipe_id: true,
    title: true,
    imageUrl: true,

    bookmarks: {
      where: {
        user_id: Number(userId),
      },
      select: {
        bookmark_id: true,
      },
    },

    ratings: {
      where: {
        user_id: Number(userId),
      },
      select: {
        score: true,
      },
    },
  };
}