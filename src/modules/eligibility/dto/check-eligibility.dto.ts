import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckEligibilityDto {
  @IsUUID()
  @IsNotEmpty()
  donorId: string;

  @IsNumber()
  @Min(5)
  @Max(25)
  @Type(() => Number)
  hemoglobin: number; // g/dL — measured at time of check

  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(200)
  @Type(() => Number)
  weight?: number; // If not provided, donor's stored weight is used
}
