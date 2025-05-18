import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email_id: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
