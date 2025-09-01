import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model.ts";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import cloudinary from "../lib/cloudinary.ts";
import { generateToken } from "../lib/utils.ts";
import { generateResetToken } from "../lib/utils.ts";
import { resetPasswordEmail } from "../lib/templates/reset-password.ts";

export const signupController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    body: { firstName, lastName, email, password },
  } = req;

  try {
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({ message: "Email already exists" });
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
      console.log("Error in signup controller:", err.message);
      return res.status(500).json({ message: `Server Error ${err.message}` });
    }
  }
};

export const oauthCallback = (_: any, res: Response) => {
  res.redirect("http://localhost:3000/");
};

export const signinController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    body: { email, password },
  } = req;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      generateToken(user._id.toString(), res);
      return res.status(200).send(user);
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ message: `Server Error ${err.message}` });
    }
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    body: { email },
  } = req;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token & expiration
    const resetToken = generateResetToken();
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // token valid of 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiration;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Cipher Chat" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: resetPasswordEmail(resetUrl, user.firstName),
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).json({ message: "Server error" });
    }
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  console.log("BODY:", req.body.password, req.body.token);
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    body: { password, token },
  } = req;

  try {
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user || !user.resetPasswordExpires) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    const now = new Date();
    if (user.resetPasswordExpires < now) {
      return res.status(401).json({ message: "Token expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: `Server error ${err.message}` });
    }
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {
      body: { profilePic },
    } = req;
    const userId = (req as any).user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("error in update profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in checkAuth controller", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  (req as any).logout((err: any) => {
    if (err) return next(err);
    res.redirect("http://localhost:3000");
  });
};
