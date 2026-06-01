import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donor } from './donor.entity';
import { DonorService } from './donor.service';
import { DonorController } from './donor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Donor])],
  controllers: [DonorController],
  providers: [DonorService],
  exports: [DonorService],
})
export class DonorModule { }