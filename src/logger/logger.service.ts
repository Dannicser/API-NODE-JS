import { ISettings, ILogObj, Logger } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';

import 'reflect-metadata';

@injectable() // можно положить в контейнер
export class LoggerService implements ILogger {
	public logger: Logger<ISettings<ILogObj>>;

	constructor() {
		this.logger = new Logger({
			type: 'pretty',
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
