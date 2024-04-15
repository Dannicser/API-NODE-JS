import { ISettings, ILogObj, Logger } from 'tslog';

export interface ILogger {
	logger: Logger<ISettings<ILogObj>>;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
