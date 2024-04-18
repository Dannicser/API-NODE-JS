import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../common/base.controller';
import { HTTPError } from '../../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IUserController } from './user.controller.interface';
import { ILogger } from '../../logger/logger.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { IUserService } from '../service/user.service.interface';
import { ValidateMiddleware } from '../../common/validate.middleware';

import 'reflect-metadata';

@injectable() // и тот класс от коротого экстендимся
// сначала extends потом implements
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
	) {
		super(loggerService); // если экстендим всегда вызываем

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.validateUser(req.body);

		if (!result) {
			return next(new HTTPError(401, 'wrong login or password'));
		}

		this.ok(res, {});
	}

	async register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.createUser(req.body);

		if (!result) {
			return next(new HTTPError(422, 'user has already existed'));
		}

		this.ok(res, result);
	}
}
