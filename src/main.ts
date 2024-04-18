import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionFilters } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './user/user.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IUserController } from './user/user.controller.interface';
import { IExceptionFilter } from './errors/exeption.filter.interface';

import { IUserService } from './user/user.service.interface';
import { UserService } from './user/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';

import 'reflect-metadata';
import { PrismaService } from './database/prisma.service';

interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

// Ручной DI
// const logger = new LoggerService();
// const app = new App(logger, new UserController(logger), new ExeptionFilters(logger));

// так можно объединять логические куски приложения
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope(); // TYPES.ILogger отдат LoggerService при инжекте
	bind<IExceptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilters);
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope(); // синглтон - позволяет создать один инстанс класса и потом шарить его во всех местах где инжектим
	bind<PrismaService>(TYPES.IPrismaService).to(PrismaService).inSingletonScope(); // обязательно сингл тон, потому что подключаемся только один раз
	bind<App>(TYPES.App).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container(); // коробка, где лежат биндинги символов на конкретные реализации

	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.App);

	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
