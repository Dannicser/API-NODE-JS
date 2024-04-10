import { Server } from "http";
import express, { Express } from "express";

import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/user.controller";

export class App {
  app: Express;
  server: Server;
  port: number;
  loggerService: LoggerService;
  userController: UserController;

  constructor(logger: LoggerService, userController: UserController) {
    this.app = express();
    this.port = 5000;
    this.loggerService = logger;
    this.userController = userController;
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  public async init() {
    this.server = this.app.listen(this.port);
    this.useRoutes();
    this.loggerService.log(`server has been started on ${this.port} port`);
  }
}
