import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

import 'reflect-metadata';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('[PrismaService] connection to database has been established');
		} catch (error) {
			this.loggerService.error('[PrismaService] connection to database has not been established - ' + error);
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$connect();
	}
}
