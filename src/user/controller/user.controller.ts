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
import { IConfigService } from '../../config/config.service.interface';
import { AuthGuard } from '../../common/auth.guard';

import 'reflect-metadata';

@injectable() // и тот класс от коротого экстендимся
// сначала extends потом implements
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.validateUser(req.body);

		if (!result) {
			return next(new HTTPError(401, 'wrong login or password'));
		}

		const secret = this.configService.get('JWT_ACCESS_SECRET');
		const access_token = await this.userService.generateJWT(req.body.email, secret);

		if (!access_token) {
			return next(new HTTPError(500, 'access_token generation error'));
		}

		this.ok(res, { access_token });
	}

	async register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.createUser(req.body);

		if (!result) {
			return next(new HTTPError(422, 'user has already existed'));
		}

		this.ok(res, {});
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await this.userService.findUser(req.user.email);

		if (!user) {
			return next(new HTTPError(404, 'user has not beed found'));
		}

		this.ok(res, {
			id: user.id,
			email: user.email,
			name: user.name,
		});
	}
}
