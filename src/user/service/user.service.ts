import { inject, injectable } from 'inversify';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../user.entity';
import { IUserService } from './user.service.interface';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUserRepository } from '../repository/user.repository.interface';
import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserRepositoty) private userRepository: IUserRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');

		const existedUser = await this.userRepository.find(email);

		if (existedUser) {
			return null;
		}

		await newUser.setPassword(password, salt);

		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);

		if (!existedUser) {
			return false;
		}

		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		return newUser.comparePassword(password);
	}
}
