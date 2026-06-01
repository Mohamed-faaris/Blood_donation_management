import { IsEnum, IsOptional, IsBoolean, IsString, Length } from 'class-validator';
import { UserRole } from '../../../common/enums';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Length(7, 15)
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
