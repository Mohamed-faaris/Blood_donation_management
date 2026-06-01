import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { CampStatus, BloodGroup } from '../../common/enums';

@Entity('camps')
@Index(['campDate'])
@Index(['city'])
export class Camp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  organizerName: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  organizerPhone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  organizerEmail: string | null;

  @Column({ length: 300 })
  venue: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ type: 'date' })
  campDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 50 })
  targetDonors: number;

  @Column({ type: 'int', default: 0 })
  registeredDonors: number;

  @Column({ type: 'int', default: 0 })
  actualDonations: number;

  @Column({ type: 'enum', enum: CampStatus, default: CampStatus.UPCOMING })
  status: CampStatus;

  // Accepted blood groups at this camp
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  acceptedBloodGroups: BloodGroup[] | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
