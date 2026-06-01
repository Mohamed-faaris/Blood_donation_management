import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { HospitalStatus } from '../../../common/enums';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  name: string;

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

  @IsEmail()
  email: string;

  @IsString()
  @Length(7, 15)
  phone: string;

  @IsOptional()
  @IsString()
  @Length(7, 15)
  alternatePhone?: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
