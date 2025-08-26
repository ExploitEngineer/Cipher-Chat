import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.ts";

export const signupController = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    body: { firstName, lastName, email, password },
  } = req;

  try {
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    generateToken(user._id.toString(), res);
    await user.save();
    return res.status(201).send(user);
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ message: `Server Error ${err.message}` });
    }
  }
};

export const oauthCallback = (_: any, res: Response) => {
  res.redirect("http://localhost:3000/");
};
