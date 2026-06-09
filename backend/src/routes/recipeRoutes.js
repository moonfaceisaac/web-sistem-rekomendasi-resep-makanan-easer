import express from "express";
// import { getRecipes, getRecipeById } from "../controllers/recipeController.js";
import { getRecipes } from "../controllers/recipeController.js";
import { 
    handleGetRecipeById,
    handleSearchRecipes,
    handleGetRecipes,
    handleGetRandomRecipes,
    handleGetRecipesWithInteraction,
    handleSearchRecipesWithInteraction,
    handleGetRecipeByIdWithInteraction
} from "../controllers/recipeController.js";

import { auth } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/interaction/:recipeId", auth, handleGetRecipeByIdWithInteraction);
router.get("/allwithinteraction",auth, handleGetRecipesWithInteraction);
router.get("/random", handleGetRandomRecipes);
router.get("/", getRecipes);
router.get("/all", handleGetRecipes);
router.get("/search", handleSearchRecipes)
router.get("/searchwithinteraction", auth, handleSearchRecipesWithInteraction)
router.get("/:id",handleGetRecipeById);



// router.get("/recipesadmin", handleGetRecipesAdmin);





export default router;
