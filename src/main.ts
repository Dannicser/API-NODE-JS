import { App } from "./app";
import { LoggerService } from "./logger/logger.service";

async function bootstrap() {
  const app = new App(new LoggerService()); // яркий пример dependency injection

  await app.init();
}

bootstrap();
