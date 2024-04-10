import express, { Request, Response } from "express";

export const userRouter = express.Router();

userRouter.get("/login", (req: Request, res: Response) => {
  res.send("login");
});

userRouter.get("/register", (req: Request, res: Response) => {
  res.send("register");
});
