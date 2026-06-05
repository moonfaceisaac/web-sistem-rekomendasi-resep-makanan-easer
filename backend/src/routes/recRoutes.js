import express from "express";
import {
  handleGetRecommendations
} from "../controllers/recommendationController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recipes", auth, handleGetRecommendations);



export default router;
