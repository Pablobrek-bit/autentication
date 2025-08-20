import { IsEmail, IsString, Length } from 'class-validator';

export class UserLoginSchema {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
