import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionFilters } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './user/user.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IUserController } from './user/user.controller.interface';
import { IExceptionFilter } from './errors/exeption.filter.interface';

import 'reflect-metadata';

interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

// Ручной DI
// const logger = new LoggerService();
// const app = new App(logger, new UserController(logger), new ExeptionFilters(logger));

// так можно объединять логические куски приложения
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService); // TYPES.ILogger отдат LoggerService при инжекте
	bind<IExceptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilters);
	bind<IUserController>(TYPES.IUserController).to(UserController);
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
