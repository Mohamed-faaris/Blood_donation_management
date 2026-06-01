import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { NotificationType } from '../../../common/enums';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  donorId: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsUUID()
  referenceId?: string;

  @IsOptional()
  @IsString()
  referenceType?: string;
}
