import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

class CredentialsUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}

export class CreateUserDto extends CredentialsUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastName: string;
  resetPasswordToken?: string;
}

export class LoginUserDto extends CredentialsUserDto {}
