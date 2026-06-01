import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RequestStatus } from '../../../common/enums';

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  unitsApproved?: number;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
