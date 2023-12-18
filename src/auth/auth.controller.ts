import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/dto/user.dto';
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
  registerAdmin(@Body() createAdminDto: CreateUserDto) {
    return this.authService.registerAdmin(createAdminDto);
  }
  @Public()
  @Get('verify/user/:token')
  verifyUser(@Param() { token }: { token: string }) {
    return this.authService.verifyUser(token);
  }
  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
