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
import { BloodGroup, DonationStatus } from '../../common/enums';
import { Donor } from '../donor/donor.entity';

@Entity('donations')
@Index(['donationDate'])
@Index(['bloodGroup'])
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Donor, (donor) => donor.donations, {
    nullable: false,
    onDelete: 'RESTRICT', // Preserve donation history even if donor is removed
  })
  @JoinColumn({ name: 'donorId' })
  donor: Donor;

  @Column()
  donorId: string;

  @Column({ type: 'enum', enum: BloodGroup })
  bloodGroup: BloodGroup;

  @Column({ type: 'date' })
  donationDate: Date;

  @Column({ type: 'int', default: 1 })
  unitsdonated: number; // Typically 1 unit per donation

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hemoglobinAtDonation: number | null; // g/dL at time of donation

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weightAtDonation: number | null; // kg at time of donation

  @Column({ type: 'enum', enum: DonationStatus, default: DonationStatus.COMPLETED })
  status: DonationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Reference to the camp if donation happened at a camp
  @Column({ type: 'varchar', nullable: true })
  campId: string | null;

  // Reference to the appointment if booked
  @Column({ type: 'varchar', nullable: true })
  appointmentId: string | null;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date | null; // Blood expires in ~42 days

  @Column({ default: false })
  isAddedToInventory: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
