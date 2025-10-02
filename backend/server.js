import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";


import userRoutes from "./routes/userroute.js";
import busroutes from "./routes/busRoutes.js";
import bookingRoutes from './routes/bookingRoutes.js';
import tourRoutes from './routes/tourRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/buses", busroutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tours', tourRoutes);



// Server Port
const PORT = process.env.PORT || 5001;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
