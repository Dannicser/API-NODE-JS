import { App } from "./app";
import { ExeptionFilters } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/user.controller";

async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(logger, new UserController(logger), new ExeptionFilters(logger)); // яркий пример dependency injection, строю дерево зависимостей

  await app.init();
}

bootstrap();
