import { UserModel } from '@prisma/client';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserLoginDto } from '../dto/user-login.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	findUser: (email: string) => Promise<UserModel | null>;

	singJWT: (email: string, secret: string) => Promise<string>;
	generateJWT: (email: string, secret: string) => Promise<string | null>;
}
