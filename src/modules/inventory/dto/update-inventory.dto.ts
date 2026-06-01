import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BloodGroup, StockStatus } from '../../../common/enums';

export class UpdateInventoryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minimumThreshold?: number;

  @IsOptional()
  @IsEnum(StockStatus)
  status?: StockStatus;
}
