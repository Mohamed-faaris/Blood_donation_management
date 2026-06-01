import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AddStockDto } from './dto/add-stock.dto';
import { IssueStockDto } from './dto/issue-stock.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { BloodGroup, UserRole } from '../../common/enums';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // GET /api/inventory  (Public)
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  // GET /api/inventory/low-stock  (Admin only)
  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getLowStock() {
    return this.inventoryService.getLowStock();
  }

  // GET /api/inventory/check/:bloodGroup/:units  (Public)
  @Get('check/:bloodGroup/:units')
  checkAvailability(
    @Param('bloodGroup') bloodGroup: BloodGroup,
    @Param('units') units: number,
  ) {
    return this.inventoryService.checkAvailability(bloodGroup, Number(units));
  }

  // GET /api/inventory/:bloodGroup  (Public)
  @Get(':bloodGroup')
  findOne(@Param('bloodGroup') bloodGroup: BloodGroup) {
    return this.inventoryService.findByBloodGroup(bloodGroup);
  }

  // POST /api/inventory/add  (Admin + Hospital)
  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  @HttpCode(HttpStatus.OK)
  addStock(@Body() dto: AddStockDto) {
    return this.inventoryService.addStock(dto);
  }

  // POST /api/inventory/issue  (Admin + Hospital)
  @Post('issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL)
  @HttpCode(HttpStatus.OK)
  issueStock(@Body() dto: IssueStockDto) {
    return this.inventoryService.issueStock(dto);
  }

  // POST /api/inventory/expire/:bloodGroup  (Admin only)
  @Post('expire/:bloodGroup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  markExpired(
    @Param('bloodGroup') bloodGroup: BloodGroup,
    @Body('units') units: number,
  ) {
    return this.inventoryService.markExpired(bloodGroup, units);
  }

  // PATCH /api/inventory/:bloodGroup  (Admin only)
  @Patch(':bloodGroup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('bloodGroup') bloodGroup: BloodGroup,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(bloodGroup, dto);
  }
}
