import User from "../models/user.model.ts";
import type { Request, Response } from "express";

export const getUsersForSidebar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loggedInUserId = (req as any).user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in getUsersForSidebar: ", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
