import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BloodGroup, Gender } from '../../common/enums';
import { Donation } from '../donation/donation.entity';
import { Appointment } from '../appointment/appointment.entity';
import { EligibilityCheck } from '../eligibility/eligibility-check.entity';
import { BloodRequest } from '../blood-request/blood-request.entity';
import { Feedback } from '../feedback/feedback.entity';
import { Notification } from '../notification/notification.entity';

@Entity('donors')
@Index(['bloodGroup'])
@Index(['city'])
export class Donor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: BloodGroup })
  bloodGroup: BloodGroup;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number; // in kg

  @Column({ length: 200 })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 10 })
  pincode: string;

  @Column({ type: 'date', nullable: true })
  lastDonationDate: Date | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  hasMedicalCondition: boolean;

  @Column({ type: 'text', nullable: true })
  medicalNotes: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hemoglobin: number | null; // g/dL

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Donation, (donation) => donation.donor)
  donations: Donation[];

  @OneToMany(() => Appointment, (appointment) => appointment.donor)
  appointments: Appointment[];

  @OneToMany(() => EligibilityCheck, (check) => check.donor)
  eligibilityChecks: EligibilityCheck[];

  @OneToMany(() => BloodRequest, (request) => request.requestedByDonor)
  bloodRequests: BloodRequest[];

  @OneToMany(() => Feedback, (feedback) => feedback.donor)
  feedbacks: Feedback[];

  @OneToMany(() => Notification, (notification) => notification.donor)
  notifications: Notification[];
}
