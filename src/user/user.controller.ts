import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IUserController } from './user.controller.interface';
import { ILogger } from '../logger/logger.interface';

import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

@injectable() // и тот класс от коротого экстендимся
// сначала extends потом implements
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService); // если экстендим всегда вызываем

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		// this.ok(res, "login");

		next(new HTTPError(404, 'user has not been found'));
	}

	async register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const newUser = new User(req.body.email, req.body.name);

		await newUser.setPassword(req.body.password);

		this.ok(res, newUser);
	}
}
