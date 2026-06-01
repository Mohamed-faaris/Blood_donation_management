import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './hospital.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateHospitalDto): Promise<Hospital> {
    const exists = await this.hospitalRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException(
        `Hospital with email "${dto.email}" already exists.`,
      );
    }
    const hospital = this.hospitalRepository.create(dto);
    return this.hospitalRepository.save(hospital);
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<Hospital[]> {
    return this.hospitalRepository.find({ order: { name: 'ASC' } });
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Hospital> {
    const hospital = await this.hospitalRepository.findOne({ where: { id } });
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID "${id}" not found.`);
    }
    return hospital;
  }

  // ─── GET BY CITY ──────────────────────────────────────────────────────────
  async findByCity(city: string): Promise<Hospital[]> {
    return this.hospitalRepository.find({
      where: { city },
      order: { name: 'ASC' },
    });
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateHospitalDto): Promise<Hospital> {
    const hospital = await this.findOne(id);
    Object.assign(hospital, dto);
    return this.hospitalRepository.save(hospital);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const hospital = await this.findOne(id);
    await this.hospitalRepository.remove(hospital);
    return { message: `Hospital "${hospital.name}" deleted successfully.` };
  }
}
