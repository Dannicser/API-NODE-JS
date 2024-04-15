import { ISettings, ILogObj, Logger } from "tslog";
import { ILogger } from "./logger.interface";

export class LoggerService implements ILogger {
  public logger: Logger<ISettings<ILogObj>>;

  constructor() {
    this.logger = new Logger({
      type: "pretty",
    });
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
}
