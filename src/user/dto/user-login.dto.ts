import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(5)
	@MaxLength(25)
	password: string;
}
