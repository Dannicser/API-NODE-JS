import { Server } from "http";
import express, { Express } from "express";

import { LoggerService } from "./logger/logger.service";

export class App {
  app: Express;
  server: Server;
  port: number;
  loggerService: LoggerService;

  constructor(logger: LoggerService) {
    this.app = express();
    this.port = 5000;
    this.loggerService = logger;
  }

  public async init() {
    this.server = this.app.listen(this.port);
    this.loggerService.log(`server has been started on ${this.port} port`);
  }
}

// app.use("/users", userRouter);
