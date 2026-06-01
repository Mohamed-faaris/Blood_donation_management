import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { DonorService } from '../donor/donor.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly donorService: DonorService,
  ) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateFeedbackDto): Promise<Feedback> {
    await this.donorService.findOne(dto.donorId); // validate donor exists
    const feedback = this.feedbackRepository.create(dto);
    return this.feedbackRepository.save(feedback);
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['donor'],
      order: { createdAt: 'DESC' },
    });
  }

  // ─── GET BY DONOR ─────────────────────────────────────────────────────────
  async findByDonor(donorId: string): Promise<Feedback[]> {
    await this.donorService.findOne(donorId);
    return this.feedbackRepository.find({
      where: { donorId },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Feedback> {
    const fb = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['donor'],
    });
    if (!fb) {
      throw new NotFoundException(`Feedback with ID "${id}" not found.`);
    }
    return fb;
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const fb = await this.findOne(id);
    await this.feedbackRepository.remove(fb);
    return { message: 'Feedback deleted.' };
  }

  // ─── AVERAGE RATING ───────────────────────────────────────────────────────
  async getAverageRating(): Promise<{ average: number; total: number }> {
    const result = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('AVG(feedback.rating)', 'average')
      .addSelect('COUNT(*)', 'total')
      .getRawOne();
    return {
      average: parseFloat(result.average) || 0,
      total: parseInt(result.total) || 0,
    };
  }
}
