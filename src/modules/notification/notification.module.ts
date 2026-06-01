import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DonorModule } from '../donor/donor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    DonorModule, // DonorService — validate donor before creating notification
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
