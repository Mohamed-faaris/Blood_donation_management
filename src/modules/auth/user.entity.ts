import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { UserRole } from '../../common/enums';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ select: false }) // Never returned in queries by default
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.DONOR })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string | null;

  // Optional link to a donor profile (if role = donor)
  @Column({ type: 'varchar', nullable: true })
  donorId: string | null;

  // Optional link to a hospital profile (if role = hospital)
  @Column({ type: 'varchar', nullable: true })
  hospitalId: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Hash password before saving
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  // Helper to compare plain vs hashed
  async validatePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
}
