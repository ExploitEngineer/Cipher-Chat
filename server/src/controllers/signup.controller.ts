import express from "express";
import type { Request, Response } from "express";

export const signupController = (req: Request, res: Response) => {
  const {
    body: { username, email, password },
  } = req;
};
