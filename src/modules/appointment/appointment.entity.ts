import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AppointmentStatus } from '../../common/enums';
import { Donor } from '../donor/donor.entity';

@Entity('appointments')
@Index(['scheduledDate'])
@Index(['status'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Donor, (donor) => donor.appointments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'donorId' })
  donor: Donor;

  @Column()
  donorId: string;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  rescheduledDate: Date | null;

  @Column({ length: 200 })
  location: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  campName: string | null;

  @Column({ type: 'varchar', nullable: true })
  campId: string | null;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.BOOKED })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
