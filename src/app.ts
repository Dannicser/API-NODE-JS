import { Server } from 'http';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exeption.filter.interface';

import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { ILogger } from './logger/logger.interface';
import { IUserController } from './user/controller/user.controller.interface';

import 'reflect-metadata';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserController) private userController: IUserController,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IPrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 5000;
	}

	useMiddlawares(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.server = this.app.listen(this.port);
		this.useMiddlawares();
		this.useRoutes();
		this.useExceptionFilters();
		this.loggerService.log(`[app] server has been started on ${this.port} port`);
		await this.prismaService.connect();
	}
}
