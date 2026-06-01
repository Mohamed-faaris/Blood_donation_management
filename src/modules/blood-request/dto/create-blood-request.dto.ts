import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BloodGroup, UrgencyLevel } from '../../../common/enums';

export class CreateBloodRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  patientName: string;

  @IsString()
  @Length(7, 15)
  patientPhone: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  hospitalName: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  hospitalAddress: string;

  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  unitsRequired: number;

  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgency?: UrgencyLevel;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsDateString()
  requiredByDate: string;

  @IsOptional()
  @IsUUID()
  requestedByDonorId?: string;
}
