import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BloodGroup } from '../../../common/enums';

export class SearchDonorDto {
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
