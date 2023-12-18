import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
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
  @Get('user')
  getUserInfo(@Req() req: any) {
    return this.authService.getUserInfo(req.user.email);
  }
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() { email }: { email: string }) {
    return this.authService.initiatePasswordReset(email);
  }
  @Public()
  @Post('reset-password/:token')
  resetPassword(
    @Param() { token }: { token: string },
    @Body() { newPassword }: { newPassword: string },
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
