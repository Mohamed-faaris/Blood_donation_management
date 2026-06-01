import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
} from 'typeorm';
import { BloodGroup, StockStatus } from '../../common/enums';

@Entity('blood_inventory')
@Index(['bloodGroup'])
@Check('"quantityUnits" >= 0') // Prevent negative stock at DB level
export class BloodInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: BloodGroup, unique: true })
  bloodGroup: BloodGroup;

  @Column({ type: 'int', default: 0 })
  quantityUnits: number; // 1 unit = 450ml approx

  @Column({ type: 'int', default: 10 })
  minimumThreshold: number; // Trigger low-stock alert

  @Column({ type: 'enum', enum: StockStatus, default: StockStatus.AVAILABLE })
  status: StockStatus;

  @Column({ type: 'date', nullable: true })
  lastUpdatedDate: Date | null;

  @Column({ type: 'int', default: 0 })
  totalDonated: number; // Cumulative stat

  @Column({ type: 'int', default: 0 })
  totalIssued: number; // Cumulative stat

  @Column({ type: 'int', default: 0 })
  totalExpired: number; // Cumulative stat

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
