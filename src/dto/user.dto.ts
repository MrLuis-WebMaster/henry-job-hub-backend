import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class CreateAdminDto extends CreateUserDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginUserDto extends CreateUserDto {}
