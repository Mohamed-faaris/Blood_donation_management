import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camp } from './camp.entity';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { CampStatus } from '../../common/enums';

@Injectable()
export class CampService {
  constructor(
    @InjectRepository(Camp)
    private readonly campRepository: Repository<Camp>,
  ) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateCampDto): Promise<Camp> {
    const camp = this.campRepository.create(dto);
    return this.campRepository.save(camp);
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<Camp[]> {
    return this.campRepository.find({ order: { campDate: 'ASC' } });
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Camp> {
    const camp = await this.campRepository.findOne({ where: { id } });
    if (!camp) {
      throw new NotFoundException(`Camp with ID "${id}" not found.`);
    }
    return camp;
  }

  // ─── GET UPCOMING ─────────────────────────────────────────────────────────
  async findUpcoming(): Promise<Camp[]> {
    return this.campRepository.find({
      where: { status: CampStatus.UPCOMING },
      order: { campDate: 'ASC' },
    });
  }

  // ─── GET BY CITY ──────────────────────────────────────────────────────────
  async findByCity(city: string): Promise<Camp[]> {
    return this.campRepository.find({
      where: { city },
      order: { campDate: 'ASC' },
    });
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateCampDto): Promise<Camp> {
    const camp = await this.findOne(id);
    Object.assign(camp, dto);
    return this.campRepository.save(camp);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const camp = await this.findOne(id);
    await this.campRepository.remove(camp);
    return { message: `Camp "${camp.name}" has been deleted.` };
  }
}
