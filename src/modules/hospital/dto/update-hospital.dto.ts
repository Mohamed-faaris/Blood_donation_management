import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { HospitalStatus } from '../../../common/enums';

export class UpdateHospitalDto {
  @IsOptional()
  @IsString()
  @Length(3, 200)
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsEnum(HospitalStatus)
  status?: HospitalStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
