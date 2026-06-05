import dotenv from "dotenv";
import app from "./app.js";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import recRoutes from "./routes/recRoutes.js"

// import images from "";



// const app = express()
const PORT = process.env.PORT || 5000;
dotenv.config();


app.use(express.json())
app.use(cors({origin:'http://localhost:5173'}))
app.use("/auth", authRoutes)
app.use("/recipes", recipeRoutes)
app.use("/admin", adminRoutes)
app.use("/user", userRoutes)
app.use("/rec", recRoutes)
app.use("/images", express.static("./public/images"))
// router.get("/ratings", authenticateToken, handleGetRatings);



app.listen(PORT,()=>{
 console.log(`Server running ${PORT}`);
});




