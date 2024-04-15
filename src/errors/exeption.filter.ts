import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

import "reflect-metadata";

@injectable()
export class ExeptionFilters implements IExceptionFilter {
  // теперь не нужно пробрасывать сверху
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HTTPError) {
      this.logger.error(`Error - ${err.message}, code - ${err.statusCode}`);
      res.status(err.statusCode).send({ error: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ error: err.message });
    }
  }
}
