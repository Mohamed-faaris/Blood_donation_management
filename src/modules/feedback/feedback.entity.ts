import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Donor } from '../donor/donor.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Donor, (donor) => donor.feedbacks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donorId' })
  donor: Donor;

  @Column()
  donorId: string;

  @Column({ type: 'int' })
  rating: number; // 1 to 5

  @Column({ type: 'text', nullable: true })
  comments: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null; // e.g. 'donation_experience', 'camp_feedback', 'general'

  // Optional reference to a camp or appointment
  @Column({ type: 'varchar', nullable: true })
  campId: string | null;

  @Column({ type: 'varchar', nullable: true })
  appointmentId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
