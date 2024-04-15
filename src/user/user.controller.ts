import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";

import "reflect-metadata";
import { IUserController } from "./user.controller.interface";

@injectable() // и тот класс от коротого экстендимся
// сначала extends потом implements
export class UserController extends BaseController implements IUserController {
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService); // если экстендим всегда вызываем

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
