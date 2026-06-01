import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { DonorModule } from '../donor/donor.module';
import { EligibilityModule } from '../eligibility/eligibility.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DonorModule,       // DonorService — validate donor
    EligibilityModule, // EligibilityService — eligibility gate for booking
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
