import rateLimit from "express-rate-limit";

// Generic rules for standard content discovery actions
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rules specifically targeting auth or data modification endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each IP to 10 creation/login attempts per hour
  message: { message: "Too many account attempts from this IP, please try again in an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});