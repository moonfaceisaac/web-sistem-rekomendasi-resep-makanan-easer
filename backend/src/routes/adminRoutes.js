import express from "express";
import {
  handleGetUsers,
  handleGetRecipesAdmin,
  handleGetRecipeAdminDetail,
  handleUpdateRecipe,
  handleAddRecipe,
  handleDeleteRecipe,
  handleDeleteUserAdmin,
} from "../controllers/adminController.js";
import { auth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", auth, requireAdmin, handleGetUsers);
router.get("/recipes", auth, requireAdmin, handleGetRecipesAdmin);
router.get(
  "/recipesdetail/:id",
  auth,
  requireAdmin,
  handleGetRecipeAdminDetail,
);
router.put("/recipes/:id", auth, requireAdmin, handleUpdateRecipe);
router.post("/recipes", auth, requireAdmin, handleAddRecipe);
router.delete("/recipes/:id", auth, requireAdmin, handleDeleteRecipe);
router.delete("/user/:id", auth, requireAdmin, handleDeleteUserAdmin);

export default router;
