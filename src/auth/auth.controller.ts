import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto, CreateAdminDto, LoginUserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
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
  @Public()
  @Get('user')
  getUserInfo(@Req() req) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      return this.authService.getUserInfo(decoded.email);
    } catch (error) {
      return { message: 'Invalid or expired token' };
    }
  }
}
