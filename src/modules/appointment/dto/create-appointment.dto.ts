import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  donorId: string;

  @IsString()
  @IsNotEmpty()
  scheduledDate: string; // ISO datetime string e.g. "2025-07-10T10:00:00"

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  location: string;

  @IsOptional()
  @IsString()
  campName?: string;

  @IsOptional()
  @IsUUID()
  campId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
