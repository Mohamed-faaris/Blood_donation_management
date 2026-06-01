import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get('donor/:donorId')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  findByDonor(@Param('donorId', ParseUUIDPipe) donorId: string) {
    return this.notificationService.findByDonor(donorId);
  }

  @Get('donor/:donorId/unread')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  findUnread(@Param('donorId', ParseUUIDPipe) donorId: string) {
    return this.notificationService.findUnread(donorId);
  }

  @Patch(':id/read')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  markRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.markRead(id);
  }

  @Patch('donor/:donorId/read-all')
  @Roles(UserRole.ADMIN, UserRole.DONOR)
  markAllRead(@Param('donorId', ParseUUIDPipe) donorId: string) {
    return this.notificationService.markAllRead(donorId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.remove(id);
  }
}
