import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CampStatus } from '../../../common/enums';

export class UpdateCampDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  campDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

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
  @Length(2, 200)
  organizerName?: string;

  @IsOptional()
  @IsString()
  @Length(7, 15)
  organizerPhone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  targetDonors?: number;

  @IsOptional()
  @IsEnum(CampStatus)
  status?: CampStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  actualDonations?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
