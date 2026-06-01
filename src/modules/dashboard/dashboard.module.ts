import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

// Import all entities needed for analytics queries
import { Donor } from '../donor/donor.entity';
import { BloodInventory } from '../inventory/blood-inventory.entity';
import { BloodRequest } from '../blood-request/blood-request.entity';
import { Donation } from '../donation/donation.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Camp } from '../camp/camp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Donor,
      BloodInventory,
      BloodRequest,
      Donation,
      Appointment,
      Camp,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
