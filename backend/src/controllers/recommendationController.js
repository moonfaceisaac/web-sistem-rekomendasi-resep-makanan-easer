// import { prisma } from "../config/prisma.js";
import {
  getRecommendations,
  getUserInteractions,
} from "../services/recommendationService.js";

export async function handleGetRecommendations(req, res) {
  try {
    const userId = req.user.id;
    const recipeIds = await getUserInteractions(req.user.id);

    if (recipeIds.length === 0) {
      return res.json({
        recommendations: [],
      });
    }

    const recommendations = await getRecommendations(recipeIds);

    return res.json(recommendations);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to get recommendations",
    });
  }
}
