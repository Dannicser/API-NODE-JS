import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private readonly secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];

			verify(token, this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (payload) {
					req.user = payload;
					next();
				}
			});
		} else {
			next();
		}
	}
}
