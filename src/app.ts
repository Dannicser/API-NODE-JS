import { Server } from "http";
import express, { Express } from "express";

import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/user.controller";
import { ExeptionFilters } from "./errors/exeption.filter";

export class App {
  app: Express;
  server: Server;
  port: number;
  exeptionFilter: ExeptionFilters;
  loggerService: LoggerService;
  userController: UserController;

  constructor(logger: LoggerService, userController: UserController, exeptionFilter: ExeptionFilters) {
    this.app = express();
    this.port = 5000;
    this.loggerService = logger;
    this.userController = userController;
    this.exeptionFilter = exeptionFilter;
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.server = this.app.listen(this.port);
    this.useRoutes();
    this.useExceptionFilters();
    this.loggerService.log(`server has been started on ${this.port} port`);
  }
}
