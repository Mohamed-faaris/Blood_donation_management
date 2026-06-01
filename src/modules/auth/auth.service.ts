import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../common/enums';

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'password' | 'hashPassword' | 'validatePassword'>;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ─── REGISTER ─────────────────────────────────────────────────────────────
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException(
        `An account with email "${dto.email}" already exists.`,
      );
    }

    const user = this.userRepository.create({
      ...dto,
      role: dto.role ?? UserRole.DONOR,
    });
    // @BeforeInsert on entity will hash the password automatically
    await this.userRepository.save(user);

    return this.buildAuthResponse(user);
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  async login(dto: LoginDto): Promise<AuthResponse> {
    // Must select password explicitly (column has select:false)
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .andWhere('user.isActive = true')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordValid = await user.validatePassword(dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Record last login time
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
    user.lastLoginAt = new Date();

    return this.buildAuthResponse(user);
  }

  // ─── GET ME ───────────────────────────────────────────────────────────────
  async getMe(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  // ─── HELPER: Build JWT + safe user object ─────────────────────────────────
  private buildAuthResponse(user: User): AuthResponse {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Strip password from response
    const { password, hashPassword, validatePassword, ...safeUser } =
      user as User & { password: string };

    return { accessToken, user: safeUser as Omit<User, 'password' | 'hashPassword' | 'validatePassword'> };
  }
}
