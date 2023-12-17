import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async registerUser(createUserDto: CreateUserDto) {
    const { name, lastName, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = new this.userModel({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user._id, role: user.role };
    const validationToken = await this.jwtService.signAsync(payload);
    user.validationToken = validationToken;

    const url = `${process.env.URL_VERIFY_USER}/${validationToken}`;

    this.mailService.sendMailConfirmation(email, name, url);

    return await user.save();
  }

  async registerAdmin(createAdminDto: CreateUserDto) {
    const { name, lastName, email, password } = createAdminDto;
    if (!email.endsWith('@soyhenry.com')) {
      throw new ConflictException(
        'Sorry, to be an administrator you must have an authorized domain.',
      );
    }

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const admin = new this.userModel({
      name,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    const payload = { email: admin.email, sub: admin._id, role: admin.role };
    const validationToken = await this.jwtService.signAsync(payload);
    admin.validationToken = validationToken;

    const url = `${process.env.URL_VERIFY_USER}/${validationToken}`;

    this.mailService.sendMailConfirmation(email, name, url);

    return await admin.save();
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (decoded.exp && nowInSeconds > decoded.exp) {
        throw new TokenExpiredError('Token expired/invalid', decoded.exp);
      }
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async verifyUser(validationToken: string): Promise<boolean> {
    try {
      const decoded = await this.verifyToken(validationToken);
      const user = await this.userModel.findOne({ validationToken }).exec();

      if (!user) {
        throw new TokenExpiredError('Token expired/invalid', decoded.exp);
      }

      user.isVerified = true;
      user.validationToken = null;
      await user.save();
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
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

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
      isVerified: user.isVerified,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async getUserInfo(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).select('-password');
  }
}
