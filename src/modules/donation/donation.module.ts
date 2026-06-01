import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { DonorModule } from '../donor/donor.module';
import { InventoryModule } from '../inventory/inventory.module';
import { EligibilityModule } from '../eligibility/eligibility.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation]),
    DonorModule,       // DonorService — fetch/validate donor, update lastDonationDate
    InventoryModule,   // InventoryService — add stock after donation
    EligibilityModule, // EligibilityService — verify donor is eligible
  ],
  controllers: [DonationController],
  providers: [DonationService],
  exports: [DonationService],
})
export class DonationModule {}
