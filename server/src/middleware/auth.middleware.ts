import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.model.ts";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const authenticateGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

export const authenticateGoogleCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    (req as any).user = user;

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Error in protectRoute middleware:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
