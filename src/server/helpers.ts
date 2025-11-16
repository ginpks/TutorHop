// auth.js (backend)
import jwt from "jsonwebtoken";

export function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function createRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
