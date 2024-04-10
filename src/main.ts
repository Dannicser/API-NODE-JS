import { App } from "./app";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/user.controller";

async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(logger, new UserController(logger)); // яркий пример dependency injection, строю дерево зависимостей

  await app.init();
}

bootstrap();
