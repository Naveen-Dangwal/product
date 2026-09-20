import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import orderRoutes from "./routers/orderRoutes.js"; // Import routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
dotenv.config();

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount the order routes
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000; // Added fallback port

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});