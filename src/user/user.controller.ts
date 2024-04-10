import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { HTTPError } from "../errors/http-error.class";

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger); // если экстендим всегда вызываем

    this.bindRoutes([
      {
        path: "/register",
        method: "get",
        func: this.register,
      },
      {
        path: "/login",
        method: "get",
        func: this.login,
      },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    // this.ok(res, "login");

    next(new HTTPError(404, "user has not been found"));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "register");
  }
}
