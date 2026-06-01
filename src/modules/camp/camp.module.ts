import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camp } from './camp.entity';
import { CampService } from './camp.service';
import { CampController } from './camp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Camp])],
  controllers: [CampController],
  providers: [CampService],
  exports: [CampService],
})
export class CampModule {}
