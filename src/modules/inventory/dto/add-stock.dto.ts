import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BloodGroup } from '../../../common/enums';

export class AddStockDto {
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  units: number;
}
