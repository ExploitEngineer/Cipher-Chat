import type { Request, Response } from "express";

export const signupController = (req: Request, res: Response) => {
  const {
    body: { username, email, password },
  } = req;
};

export const oauthCallback = (_: any, res: Response) => {
  res.redirect("http://localhost:3000/");
};
