
import { 
  searchRecipes, 
  getAllRecipes,
  getRecipeById,
  findAllRecipes,
  getRandomRecipes,
  getAllRecipesWithInteraction,
  getRecipeByIdWithInteraction,
  searchRecipesWithInteraction
} from "../services/recipeService.js";

export const getRecipes = async (req, res) => {
  try {
    const recipes = await findAllRecipes();

    res.json(recipes);
  } catch {
    res.status(500).json({
      message: "Error",
    });
  }
};

// export const getRecipeById = async (req, res) => {
//   try {
//     const recipe = await findRecipeById(req.params.id);

//     res.json(recipe);
//   } catch {
//     res.status(500).json({
//       message: "Error",
//     });
//   }
// };

export async function handleGetRecipeById(req, res) {
  try {
    const { id } = req.params;

    const recipe = await getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    return res.status(200).json(recipe);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function handleSearchRecipes(req, res) {
  try {
    const keyword = req.query.keyword || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 20;

    const result = await searchRecipes(
      keyword,
      page,
      limit
    );

    return res.status(200).json(result);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
}



export async function handleGetRecipes(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 20;

    const result = await getAllRecipes(page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}



export async function handleGetRandomRecipes(req, res) {
  try {
    const limit = Number(req.query.limit) || 20;

    const recipes = await getRandomRecipes(limit);

    return res.status(200).json({
      recipes,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function handleGetRecipesWithInteraction(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 20;
    
    const userId = Number(req.user.id);

    const result = await getAllRecipesWithInteraction(userId, page, limit);
    
    

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function handleSearchRecipesWithInteraction(req, res) {
  try {
    const keyword = req.query.keyword || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 20;

    const userId = Number(req.user.id);

    const result = await searchRecipesWithInteraction(
      userId,
      keyword,
      page,
      limit
    );

    return res.status(200).json(result);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
}

export async function handleGetRecipeByIdWithInteraction(req, res) {
  try {
    const { recipeId } = req.params;

    const userId = Number(req.user.id);

    const recipe = await getRecipeByIdWithInteraction(userId, recipeId);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    return res.status(200).json(recipe);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
