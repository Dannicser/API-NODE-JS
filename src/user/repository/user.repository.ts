import { inject, injectable } from 'inversify';
import { IUserRepository } from './user.repository.interface';
import { TYPES } from '../../types';
import { PrismaService } from '../../database/prisma.service';
import { User } from '../user.entity';
import { UserModel } from '@prisma/client';

@injectable()
export class UserRepositoty implements IUserRepository {
	constructor(@inject(TYPES.IPrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({ where: { email } });
	}
}
