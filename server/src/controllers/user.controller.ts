import User from "../models/user.model.ts";
import type { Response } from "express";

export const userController = async (_: any, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    console.log("Error fetching users", err);
    res.status(400).json({ message: `Internal Server Error` });
  }
};
