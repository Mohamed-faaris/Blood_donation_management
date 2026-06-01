import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('donations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  // POST /api/donations  (Admin only)
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDonationDto) {
    return this.donationService.create(dto);
  }

  // GET /api/donations  (Admin only)
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.donationService.findAll();
  }

  // GET /api/donations/stats  (Admin only)
  @Get('stats')
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.donationService.getStats();
  }

  // GET /api/donations/donor/:donorId  (Admin + Donor)
  @Get('donor/:donorId')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  findByDonor(@Param('donorId', ParseUUIDPipe) donorId: string) {
    return this.donationService.findByDonor(donorId);
  }

  // GET /api/donations/:id  (Admin + Donor)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donationService.findOne(id);
  }

  // PATCH /api/donations/:id/cancel  (Admin only)
  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.donationService.cancel(id);
  }
}
