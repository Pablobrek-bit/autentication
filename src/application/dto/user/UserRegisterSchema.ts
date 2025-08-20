import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UserRegisterSchema {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  @Length(2, 100)
  @IsOptional()
  fullName: string;
}
