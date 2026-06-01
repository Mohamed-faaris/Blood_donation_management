import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '../../../common/enums';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  scheduledDate?: string; // For rescheduling

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
