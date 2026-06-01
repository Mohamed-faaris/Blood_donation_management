import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  // POST /api/hospitals  (Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateHospitalDto) {
    return this.hospitalService.create(dto);
  }

  // GET /api/hospitals  (Public)
  @Get()
  findAll(@Query('city') city?: string) {
    if (city) return this.hospitalService.findByCity(city);
    return this.hospitalService.findAll();
  }

  // GET /api/hospitals/:id  (Public)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.hospitalService.findOne(id);
  }

  // PATCH /api/hospitals/:id  (Admin only)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateHospitalDto,
  ) {
    return this.hospitalService.update(id, dto);
  }

  // DELETE /api/hospitals/:id  (Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.hospitalService.remove(id);
  }
}
