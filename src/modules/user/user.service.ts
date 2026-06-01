import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { UpdateUserRoleDto, UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ─── GET ALL USERS (Admin only) ───────────────────────────────────────────
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // ─── GET ONE ──────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID "${id}" not found.`);
    return user;
  }

  // ─── UPDATE ROLE ──────────────────────────────────────────────────────────
  async updateRole(id: string, dto: UpdateUserRoleDto): Promise<User> {
    const user = await this.findOne(id);
    user.role = dto.role;
    return this.userRepository.save(user);
  }

  // ─── UPDATE PROFILE ───────────────────────────────────────────────────────
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  // ─── DEACTIVATE ───────────────────────────────────────────────────────────
  async deactivate(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
    return { message: `User "${user.email}" has been deactivated.` };
  }
}
