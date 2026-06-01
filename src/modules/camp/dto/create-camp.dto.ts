import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BloodGroup } from '../../../common/enums';

export class CreateCampDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  organizerName: string;

  @IsOptional()
  @IsString()
  @Length(7, 15)
  organizerPhone?: string;

  @IsOptional()
  @IsEmail()
  organizerEmail?: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 300)
  venue: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  state: string;

  @IsDateString()
  campDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string; // "09:00"

  @IsString()
  @IsNotEmpty()
  endTime: string; // "17:00"

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  targetDonors?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(BloodGroup, { each: true })
  acceptedBloodGroups?: BloodGroup[];

  @IsOptional()
  @IsString()
  description?: string;
}
