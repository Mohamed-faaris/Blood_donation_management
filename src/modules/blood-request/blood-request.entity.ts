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
import { BloodGroup, RequestStatus, UrgencyLevel } from '../../common/enums';
import { Donor } from '../donor/donor.entity';

@Entity('blood_requests')
@Index(['status'])
@Index(['bloodGroup'])
export class BloodRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Patient details (stored directly for integrity — patient may not be a donor)
  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 15 })
  patientPhone: string;

  @Column({ length: 150 })
  hospitalName: string;

  @Column({ length: 200 })
  hospitalAddress: string;

  @Column({ type: 'enum', enum: BloodGroup })
  bloodGroup: BloodGroup;

  @Column({ type: 'int' })
  unitsRequired: number;

  @Column({ type: 'int', default: 0 })
  unitsApproved: number;

  @Column({ type: 'enum', enum: UrgencyLevel, default: UrgencyLevel.NORMAL })
  urgency: UrgencyLevel;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ type: 'text', nullable: true })
  reason: string | null; // Medical reason for request

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ type: 'date' })
  requiredByDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  fulfilledAt: Date | null;

  // Optional: if requested by a registered donor
  @ManyToOne(() => Donor, (donor) => donor.bloodRequests, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'requestedByDonorId' })
  requestedByDonor: Donor | null;

  @Column({ type: 'varchar', nullable: true })
  requestedByDonorId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
