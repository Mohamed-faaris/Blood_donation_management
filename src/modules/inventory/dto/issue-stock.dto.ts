import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BloodGroup } from '../../../common/enums';

export class IssueStockDto {
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  units: number;

  @IsString()
  issuedTo: string; // Patient name or request ID reference
}
