import { Server } from "http";
import express, { Express } from "express";

import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/user.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { IExceptionFilter } from "./errors/exeption.filter.interface";

import "reflect-metadata";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private loggerService: LoggerService,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: IExceptionFilter
  ) {
    this.app = express();
    this.port = 5000;
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
