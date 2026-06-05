import express from "express";
import {
  handleGetProfile,
  handleGetBookmarks,
  handleGetRatings,
  handleEditProfile,
  handleInteractionStatus,
  handleCreateBookmark
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/bookmarks", auth, handleGetBookmarks);
router.get("/profile", auth, handleGetProfile);
router.put("/profile", auth, handleEditProfile);
router.get("/ratings", auth, handleGetRatings);
router.get("/interaction-status", auth, handleInteractionStatus);
router.post("/bookmarks", auth, handleCreateBookmark);

export default router;
