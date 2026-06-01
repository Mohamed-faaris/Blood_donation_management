import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DonorService } from './donor.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { SearchDonorDto } from './dto/search-donor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('donors')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  // POST /api/donors  (Public — registration)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDonorDto) {
    return this.donorService.create(dto);
  }

  // GET /api/donors  (Admin + Hospital)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  findAll() {
    return this.donorService.findAll();
  }

  // GET /api/donors/search?bloodGroup=A+&city=Chennai  (Admin + Hospital)
  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  search(@Query() query: SearchDonorDto) {
    return this.donorService.search(query);
  }

  // GET /api/donors/:id  (Admin + Hospital + Donor)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorService.findOne(id);
  }

  // PATCH /api/donors/:id  (Admin + Donor)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDonorDto,
  ) {
    return this.donorService.update(id, dto);
  }

  // DELETE /api/donors/:id  (Admin only — soft deactivate)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorService.remove(id);
  }

  // DELETE /api/donors/:id/hard  (Admin only — permanent)
  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  hardDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorService.hardDelete(id);
  }
}
