import {
  getUsers,
  getRecipesAdmin,
  getRecipeAdminDetail,
  editRecipesAdmin,
  addRecipeAdmin,
  deleteRecipeAdmin,
} from "../services/adminService.js";

export async function handleGetUsers(req, res) {
  try {
    const keyword = req.query.keyword || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getUsers(keyword, page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function handleGetRecipesAdmin(req, res) {
  try {
    const keyword = req.query.query || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getRecipesAdmin(keyword, page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function handleGetRecipeAdminDetail(req, res) {
  try {
    const recipeId = Number(req.params.id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        message: "Invalid recipe id",
      });
    }

    const result = await getRecipeAdminDetail(recipeId);

    if (!result.recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function handleUpdateRecipe(req, res) {
  try {
    const recipeId = req.params.id;

    const recipe = await editRecipesAdmin(recipeId, req.body);

    return res.status(200).json(recipe);
  } catch (err) {
    console.log(err);

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      fieldErrors: err.fieldErrors,
    });
  }
}

export async function handleAddRecipe(req, res) {
  try {
    const data = await addRecipeAdmin(req.body);

    return res.status(201).json(data);
  } catch (err) {
    console.log(err);

    return res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      fieldErrors: err.fieldErrors,
    });
  }
}

export async function handleDeleteRecipe(req, res) {
  try {
    const recipeId = req.params.id;

    await deleteRecipeAdmin(recipeId);

    return res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
