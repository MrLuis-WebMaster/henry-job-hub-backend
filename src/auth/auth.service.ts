import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto, CreateAdminDto, LoginUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async registerUser(createUserDto: CreateUserDto) {

    const { email, password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);

    const user = new this.userModel({ email, password: hashedPassword });
    console.log(user)
    return await user.save();
  }

  async registerAdmin(createAdminDto: CreateAdminDto) {
    const { email, password, role } = createAdminDto;

    if (!email.endsWith('@soyhenry.com')) {
      throw new ConflictException(
        'Sorry, to be an administrator you must have an authorized domain.',
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const admin = new this.userModel({ email, password: hashedPassword, role });
    return await admin.save();
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(
        `Sorry, we did not find an account for the mail ${email}`,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    console.log(accessToken)

    return { accessToken };
  }
}
