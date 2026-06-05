import express from "express";
import {
  handleGetUsers,
  handleGetRecipesAdmin,
  handleGetRecipeAdminDetail,
  handleUpdateRecipe,
  handleAddRecipe
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", handleGetUsers);
router.get("/recipes", handleGetRecipesAdmin);
router.get("/recipesdetail/:id", handleGetRecipeAdminDetail);
router.put("/recipes/:id", handleUpdateRecipe);
router.post("/recipes",handleAddRecipe)

export default router;
