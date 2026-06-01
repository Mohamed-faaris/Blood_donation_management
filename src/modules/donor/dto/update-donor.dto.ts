import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BloodGroup, Gender } from '../../../common/enums';

export class UpdateDonorDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(7, 15)
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(200)
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsString()
  @Length(5, 200)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(4, 10)
  pincode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  hasMedicalCondition?: boolean;

  @IsOptional()
  @IsString()
  medicalNotes?: string;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(25)
  @Type(() => Number)
  hemoglobin?: number;
}
