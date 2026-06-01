import {
  Controller, Post, Get, Body, Param, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';
import { EligibilityService } from './eligibility.service';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('eligibility')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Post('check')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  @HttpCode(HttpStatus.OK)
  check(@Body() dto: CheckEligibilityDto) {
    return this.eligibilityService.checkEligibility(dto);
  }

  @Get('donor/:donorId')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  getHistory(@Param('donorId', ParseUUIDPipe) donorId: string) {
    return this.eligibilityService.getHistory(donorId);
  }

  @Get('donor/:donorId/latest')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  getLatest(@Param('donorId', ParseUUIDPipe) donorId: string) {
    return this.eligibilityService.getLatestCheck(donorId);
  }
}