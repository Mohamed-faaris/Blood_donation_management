import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';
import { CampService } from './camp.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('camps')
export class CampController {
  constructor(private readonly campService: CampService) {}

  // POST /api/camps  (Admin + Hospital)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCampDto) {
    return this.campService.create(dto);
  }

  // GET /api/camps  (Public)
  @Get()
  findAll(@Query('city') city?: string) {
    if (city) return this.campService.findByCity(city);
    return this.campService.findAll();
  }

  // GET /api/camps/upcoming  (Public)
  @Get('upcoming')
  findUpcoming() {
    return this.campService.findUpcoming();
  }

  // GET /api/camps/:id  (Public)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.campService.findOne(id);
  }

  // PATCH /api/camps/:id  (Admin + Hospital)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCampDto,
  ) {
    return this.campService.update(id, dto);
  }

  // DELETE /api/camps/:id  (Admin + Hospital)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.campService.remove(id);
  }
}
