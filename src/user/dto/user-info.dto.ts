import { IsEmail } from 'class-validator';

export class UserInfoDto {
	@IsEmail()
	email: string;
}
