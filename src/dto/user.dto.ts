import { IsEmail, IsNotEmpty, IsEnum, IsStrongPassword } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

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
}

export class CreateAdminDto extends CreateUserDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginUserDto extends CredentialsUserDto {}
