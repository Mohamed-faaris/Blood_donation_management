import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Donor } from '../donor/donor.entity';

@Entity('eligibility_checks')
export class EligibilityCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Donor, (donor) => donor.eligibilityChecks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donorId' })
  donor: Donor;

  @Column()
  donorId: string;

  @Column({ type: 'int' })
  ageAtCheck: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weightAtCheck: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hemoglobinAtCheck: number | null;

  @Column({ type: 'int', nullable: true })
  daysSinceLastDonation: number | null;

  @Column({ default: false })
  isEligible: boolean;

  @Column({ type: 'text', nullable: true })
  ineligibilityReason: string | null; // Detailed reason if not eligible

  @Column({ type: 'simple-array', nullable: true })
  failedCriteria: string[] | null; // e.g. ['weight', 'hemoglobin']

  @CreateDateColumn()
  checkedAt: Date;
}
