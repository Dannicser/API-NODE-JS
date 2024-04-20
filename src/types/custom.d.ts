// можно расширить типизацию либы за счет мержа интерфейсов с одинаковыми названиями

declare namespace Express {
	export interface Request {
		user: JwtPayload;
	}
}
