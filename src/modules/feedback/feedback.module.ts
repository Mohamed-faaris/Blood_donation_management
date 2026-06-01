import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { DonorModule } from '../donor/donor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    DonorModule, // DonorService — validate donor before creating feedback
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
