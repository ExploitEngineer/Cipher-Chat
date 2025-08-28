import { body } from "express-validator";

export const signUpValidator = [
  body("firstName").trim().notEmpty().withMessage("first-name cannot be empty"),
  body("lastName").trim().notEmpty().withMessage("last-name cannot be empty"),
  body("email").trim().isEmail().withMessage("email is required"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password cannot be empty")
    .isLength({ min: 6, max: 46 })
    .withMessage(
      "password must be at least 6 characters with a max of 46 characters",
    ),
];

export const signInValidator = [
  body("email").trim().isEmail().withMessage("email is required"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password cannot be empty")
    .isLength({ min: 6, max: 46 })
    .withMessage(
      "password must be at least 6 characters with a max of 46 characters",
    ),
];

export const forgotPasswordValidator = body("email")
  .trim()
  .isEmail()
  .withMessage("email is required");
