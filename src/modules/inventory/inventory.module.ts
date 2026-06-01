import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodInventory } from './blood-inventory.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BloodInventory])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService], // Exported for DonationService and BloodRequestService
})
export class InventoryModule {}
