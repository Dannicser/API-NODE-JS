import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail()
	email: string;

	@MinLength(5)
	@MaxLength(25)
	@IsString()
	password: string;

	@MinLength(5)
	@MaxLength(25)
	@IsString()
	name: string;
}
