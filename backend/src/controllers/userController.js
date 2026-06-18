import {
  getUserById,
  getRatings,
  getBookmarks,
  editUserById,
  updateUserPhotoById,
  getInteractionStatus,
  createBookmark,
  deleteBookmark,
  createRating,
  deleteRating,
} from "../services/userService.js";

export async function handleGetProfile(req, res) {
  try {
    console.log("params:", req.params);
    console.log("user:", req.user);

    // const user = await getUserById(req.params.id);
    const user = await getUserById(req.user.id);

    return res.status(200).json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
    console.log(user);
  }
}

export async function handleEditProfile(req, res) {
  try {
    const updatedUser = await editUserById(req.user.id, req.body);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
}

export async function handleUpdateProfilePhoto(req, res) {
  try {
    const updatedUser = await updateUserPhotoById(req.user.id, req.body.photo);

    return res.status(200).json({
      message: "Profile photo updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
}

export async function handleGetBookmarks(req, res) {
  try {
    const userId = Number(req.user.id);

    const keyword = req.query.keyword || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getBookmarks(userId, keyword, page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function handleGetRatings(req, res) {
  try {
    const userId = Number(req.user.id);

    const keyword = req.query.keyword || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getRatings(userId, keyword, page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function handleInteractionStatus(req, res) {
  try {
    const result = await getInteractionStatus(req.user.id);

    return res.json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function handleCreateBookmark(req, res) {
  try {
    const userId = Number(req.user.id);
    const { recipeId } = req.body;

    const bookmark = await createBookmark(userId, recipeId);

    return res.status(201).json({
      message: "Recipe bookmarked successfully",
      bookmark,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}
export async function handleDeleteBookmark(req, res) {
  try {
    const userId = Number(req.user.id);
    const { recipeId } = req.body;

    const bookmark = await deleteBookmark(userId, recipeId);

    return res.status(201).json({
      message: "Recipe deleted successfully",
      bookmark,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function handleCreateRating(req, res) {
  try {
    const userId = Number(req.user.id);
    const { recipeId, score } = req.body;
    // const score = req.body.score

    const rating = await createRating(userId, recipeId, score);

    return res.status(201).json({
      message: "Recipe Rated successfully",
      rating,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function handleDeleteRating(req, res) {
  try {
    const userId = Number(req.user.id);
    const { recipeId } = req.body;

    const rating = await deleteRating(userId, recipeId);

    return res.status(201).json({
      message: "Recipe deleted successfully",
      rating,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}
