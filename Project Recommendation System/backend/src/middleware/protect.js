import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_me";

/**
 * Express middleware that verifies a Bearer JWT on protected routes.
 * Attaches `req.user = { id }` on success.
 *
 * Usage:
 *   import { protect } from "../middleware/protect.js";
 *   router.get("/me", protect, handler);
 */
export function protect(req, res, next) {
  const authHeader = req.headers?.authorization ?? "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "No token, authorisation denied." });
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Token is invalid or expired." });
  }
}
