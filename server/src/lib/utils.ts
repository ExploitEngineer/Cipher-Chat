import type { Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (userId: string, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined!");
  }

  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 1000, // Milli Seconds
    httpOnly: true, // prevent XSS attacks cross-stie-scripting attackts
    sameSite: "strict", // CSRF attacks cross-site request forgery attack
  });

  return token;
};

export const generateResetToken = () => {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};
