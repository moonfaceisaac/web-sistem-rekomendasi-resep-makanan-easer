import express from "express";
import {
  handleGetProfile,
  handleGetBookmarks,
  handleGetRatings,
  handleEditProfile,
  handleInteractionStatus,
  handleCreateBookmark,
  handleDeleteBookmark,
  handleCreateRating,
  handleDeleteRating
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/bookmarks", auth, handleGetBookmarks);
router.get("/profile", auth, handleGetProfile);
router.put("/profile", auth, handleEditProfile);
router.get("/ratings", auth, handleGetRatings);
router.get("/interaction-status", auth, handleInteractionStatus);
router.post("/bookmarks", auth, handleCreateBookmark);
router.delete("/bookmarks", auth, handleDeleteBookmark);
router.post("/rating", auth, handleCreateRating);
router.delete("/rating", auth, handleDeleteRating);


export default router;
