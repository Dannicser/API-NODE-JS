// выполняется один раз, в отличии от beforeEach, которая выполняется перед каждым тестом

import 'reflect-metadata'; //  всегда вверху в тестах

import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IUserRepository } from '../repository/user.repository.interface';
import { IUserService } from './user.service.interface';
import { UserService } from './user.service';
import { TYPES } from '../../types';
import { User } from '../user.entity';
import { UserModel } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const СonfigServiceMock: IConfigService = {
	get: jest.fn(), // мокаем функции сервиса
};

const UserRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container(); // создали контейнер и напихали то что нужно, огромный плюс DI

let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(СonfigServiceMock); // биндим к константе, чтобы потом подставить мок
	container.bind<IUserRepository>(TYPES.IUserRepositoty).toConstantValue(UserRepositoryMock);

	// кладем реальные сервисы
	userService = container.get<IUserService>(TYPES.IUserService);
	configService = container.get<IConfigService>(TYPES.IConfigService);
	userRepository = container.get<IUserRepository>(TYPES.IUserRepositoty);
});

describe('UserService', () => {
	test('create user', async () => {
		configService.get = jest.fn().mockReturnValueOnce(1); // просто возвращает 1
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				email: user.email,
				name: user.name,
				password: user.password,
				id: 1,
			}),
		);

		const createdUser = await userService.createUser({
			email: 'test@mail.ru',
			name: 'dan',
			password: '1',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	test('validate user - success', async () => {
		userRepository.find = jest.fn().mockReturnValue({ email: 'test@mail.ru', password: hashSync('1', 1) });

		const res = await userService.validateUser({ email: 'test@mail.ru', password: '1' });

		expect(res).toBe(true);
	});

	test('validate user - wrong password', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce({ email: 'test@mail.ru', password: hashSync('1', 1) });

		const res = await userService.validateUser({ email: 'test@mail.ru', password: '2' });

		expect(res).toBe(false);
	});

	test('validate user - user has not been found', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);

		const res = await userService.validateUser({ email: 'test@mail.ru', password: '123' });

		expect(res).toBe(false);
	});
});
