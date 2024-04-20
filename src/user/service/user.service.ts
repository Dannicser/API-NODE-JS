import { inject, injectable } from 'inversify';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../user.entity';
import { IUserService } from './user.service.interface';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUserRepository } from '../repository/user.repository.interface';
import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';

import { sign } from 'jsonwebtoken';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserRepositoty) private userRepository: IUserRepository,
	) {}

	public async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');

		const existedUser = await this.userRepository.find(email);

		if (existedUser) {
			return null;
		}

		await newUser.setPassword(password, salt);

		return this.userRepository.create(newUser);
	}

	public async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);

		if (!existedUser) {
			return false;
		}

		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		return newUser.comparePassword(password);
	}

	public async generateJWT(email: string, secret: string): Promise<string | null> {
		try {
			const access_token = await this.singJWT(email, secret);

			return access_token;
		} catch (error) {
			return null;
		}
	}

	public async singJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign({ email, iat: Math.floor(Date.now() / 1000) }, secret, { algorithm: 'HS256' }, (error, token) => {
				if (error) {
					reject(null);
				} else if (token) {
					resolve(token);
				}
			});
		});
	}
}
