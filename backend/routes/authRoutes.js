import express from "express";
import { body } from "express-validator";
import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Strict Rate Limiter specifically for Auth endpoints (login/register)
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 mins
//   max: 5, // Limit each IP to 5 requests per window
//   message: { message: "Too many attempts. Please try again after 15 minutes." },
// });

// Public routes
router.post(
  "/register",
  // authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter"),
  ],
  register
);
router.get("/verify-email", verifyEmail);
router.post(
  "/login",
  // authLimiter,
  [
    body("email").trim().notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);
router.post(
  "/forgot-password",
  // authLimiter,
  [body("email").trim().isEmail().withMessage("Please provide a valid email").normalizeEmail()],
  forgotPassword
);
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter"),
  ],
  resetPassword
);

// Protected routes
router.get("/me", authMiddleware, getMe);

export default router;
