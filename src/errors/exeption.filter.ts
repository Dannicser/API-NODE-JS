import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";

export class ExeptionFilters implements IExceptionFilter {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

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
