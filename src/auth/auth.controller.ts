import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, CreateAdminDto, LoginUserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register/user')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }
  @Public()
  @Post('register/admin')
  registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.registerAdmin(createAdminDto);
  }
  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
