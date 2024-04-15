import { Container } from "inversify";
import { App } from "./app";
import { ExeptionFilters } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/user.controller";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { IExceptionFilter } from "./errors/exeption.filter.interface";

import "reflect-metadata";

// Ручной DI
// const logger = new LoggerService();
// const app = new App(logger, new UserController(logger), new ExeptionFilters(logger));

const appContainer = new Container(); // коробка, где лежат биндинги символов на конкретные реализации

appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService); // TYPES.ILogger отдат LoggerService при инжекте
appContainer.bind<IExceptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilters);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);
appContainer.bind<App>(TYPES.App).to(App);

const app = appContainer.get<App>(TYPES.App);

app.init();

export { app, appContainer };
