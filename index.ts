import express, { NextFunction, Request, Response } from "express";

import { userRouter } from "./users/users.js";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

app.use("/users", userRouter);

const port = 5000;

app.listen(port, () => console.log("start on", port, "port"));
