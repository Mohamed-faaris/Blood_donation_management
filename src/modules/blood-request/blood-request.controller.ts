import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { BloodRequestService } from './blood-request.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestStatus, UserRole } from '../../common/enums';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('requests')
export class BloodRequestController {
  constructor(private readonly requestService: BloodRequestService) {}

  // POST /api/requests  (Hospital + Donor + Admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL, UserRole.DONOR)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBloodRequestDto) {
    return this.requestService.create(dto);
  }

  // GET /api/requests  (Admin + Hospital)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  findAll(@Query('status') status?: RequestStatus) {
    if (status) return this.requestService.findByStatus(status);
    return this.requestService.findAll();
  }

  // GET /api/requests/:id  (Admin + Hospital)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestService.findOne(id);
  }

  // PATCH /api/requests/:id/status  (Admin + Hospital)
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.requestService.updateStatus(id, dto);
  }

  // PATCH /api/requests/:id/cancel  (Admin + Hospital + Donor)
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL, UserRole.DONOR)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestService.cancel(id);
  }
}
