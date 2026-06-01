import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
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

export class CreateDonorDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(7, 15)
  phone: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsNumber()
  @Min(40)
  @Max(200)
  @Type(() => Number)
  weight: number;

  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  state: string;

  @IsString()
  @Length(4, 10)
  pincode: string;

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

  @IsOptional()
  @IsDateString()
  lastDonationDate?: string;
}
