import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { HospitalStatus } from '../../common/enums';

@Entity('hospitals')
@Index(['city'])
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 10 })
  pincode: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  alternatePhone: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  contactPersonName: string | null;

  @Column({ type: 'enum', enum: HospitalStatus, default: HospitalStatus.ACTIVE })
  status: HospitalStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Optionally link to the user account created for this hospital
  @Column({ type: 'varchar', nullable: true })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
