import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRequest } from './blood-request.entity';
import { BloodRequestService } from './blood-request.service';
import { BloodRequestController } from './blood-request.controller';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BloodRequest]),
    InventoryModule, // Provides InventoryService for stock checking
  ],
  controllers: [BloodRequestController],
  providers: [BloodRequestService],
  exports: [BloodRequestService],
})
export class BloodRequestModule {}
