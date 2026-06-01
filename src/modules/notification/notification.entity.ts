import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { NotificationType } from '../../common/enums';
import { Donor } from '../donor/donor.entity';

@Entity('notifications')
@Index(['isRead'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Donor, (donor) => donor.notifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donorId' })
  donor: Donor;

  @Column()
  donorId: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.GENERAL })
  type: NotificationType;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date | null;

  // Optional reference to related entity
  @Column({ type: 'varchar', nullable: true })
  referenceId: string | null; // e.g. appointmentId, requestId

  @Column({ type: 'varchar', length: 50, nullable: true })
  referenceType: string | null; // e.g. 'appointment', 'blood_request'

  @CreateDateColumn()
  createdAt: Date;
}
