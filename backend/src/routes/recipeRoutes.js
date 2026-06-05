import express from "express";
// import { getRecipes, getRecipeById } from "../controllers/recipeController.js";
import { getRecipes } from "../controllers/recipeController.js";
import { handleGetRecipeById, handleSearchRecipes, handleGetRecipes, handleGetRandomRecipes} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/random", handleGetRandomRecipes);
router.get("/", getRecipes);
router.get("/all", handleGetRecipes);
router.get("/search", handleSearchRecipes)
router.get("/:id",handleGetRecipeById);



// router.get("/recipesadmin", handleGetRecipesAdmin);





export default router;
