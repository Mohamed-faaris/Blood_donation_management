import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EligibilityCheck } from './eligibility-check.entity';
import { EligibilityService } from './eligibility.service';
import { EligibilityController } from './eligibility.controller';
import { DonorModule } from '../donor/donor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EligibilityCheck]),
    DonorModule, // Provides DonorService
  ],
  controllers: [EligibilityController],
  providers: [EligibilityService],
  exports: [EligibilityService], // Exported for DonationService and AppointmentService
})
export class EligibilityModule {}
