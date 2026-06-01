import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BloodGroup } from '../../../common/enums';

export class CreateDonationDto {
  @IsUUID()
  @IsNotEmpty()
  donorId: string;

  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsDateString()
  donationDate: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  @Type(() => Number)
  unitsdonated?: number;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(25)
  @Type(() => Number)
  hemoglobinAtDonation?: number;

  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(200)
  @Type(() => Number)
  weightAtDonation?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  campId?: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;
}
