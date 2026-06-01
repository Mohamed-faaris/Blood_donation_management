import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { DonorService } from '../donor/donor.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly donorService: DonorService,
  ) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateNotificationDto): Promise<Notification> {
    await this.donorService.findOne(dto.donorId); // validate donor exists
    const notification = this.notificationRepository.create(dto);
    return this.notificationRepository.save(notification);
  }

  // ─── GET ALL FOR DONOR ─────────────────────────────────────────────────────
  async findByDonor(donorId: string): Promise<Notification[]> {
    await this.donorService.findOne(donorId);
    return this.notificationRepository.find({
      where: { donorId },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── GET UNREAD FOR DONOR ─────────────────────────────────────────────────
  async findUnread(donorId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { donorId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── MARK AS READ ─────────────────────────────────────────────────────────
  async markRead(id: string): Promise<Notification> {
    const notif = await this.notificationRepository.findOne({ where: { id } });
    if (!notif) {
      throw new NotFoundException(`Notification with ID "${id}" not found.`);
    }
    notif.isRead = true;
    notif.readAt = new Date();
    return this.notificationRepository.save(notif);
  }

  // ─── MARK ALL READ FOR DONOR ──────────────────────────────────────────────
  async markAllRead(donorId: string): Promise<{ updated: number }> {
    const result = await this.notificationRepository.update(
      { donorId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return { updated: result.affected ?? 0 };
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const notif = await this.notificationRepository.findOne({ where: { id } });
    if (!notif) {
      throw new NotFoundException(`Notification with ID "${id}" not found.`);
    }
    await this.notificationRepository.remove(notif);
    return { message: 'Notification deleted.' };
  }
}
