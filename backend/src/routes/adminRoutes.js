import express from "express";
import {
  handleGetUsers,
  handleGetRecipesAdmin,
  handleGetRecipeAdminDetail,
  handleUpdateRecipe,
  handleAddRecipe,
  handleDeleteRecipe
} from "../controllers/adminController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users",auth, handleGetUsers);
router.get("/recipes",auth, handleGetRecipesAdmin);
router.get("/recipesdetail/:id",auth, handleGetRecipeAdminDetail);
router.put("/recipes/:id",auth, handleUpdateRecipe);
router.post("/recipes", auth, handleAddRecipe)
router.delete("/recipes/:id", auth, handleDeleteRecipe)

export default router;
