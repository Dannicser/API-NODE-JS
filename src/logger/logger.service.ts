import { ISettings, ILogObj, Logger } from "tslog";

export class LoggerService {
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

// displayInstanceName: false,
// displayLoggerName: false,
// displayFilePath: "hidden",
// displayfunctionName: false,
