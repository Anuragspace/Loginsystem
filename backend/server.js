import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// Global Rate Limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   message: { message: "Too many requests from this IP, please try again after 15 minutes." },
// });
// app.use("/api", limiter);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Clean trailing slashes from env vars
      const cleanEnvUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null;
      
      const allowedOrigins = [
        "http://localhost:5173", 
        cleanEnvUrl,
        "https://safeloginsystem.vercel.app" // Hardcoded for guaranteed connection
      ].filter(Boolean);
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS BLOCKED ORIGIN: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent payload DOS
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🚀 Auth API is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
