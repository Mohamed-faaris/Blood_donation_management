import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Donor } from './donor.entity';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { SearchDonorDto } from './dto/search-donor.dto';

@Injectable()
export class DonorService {
  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
  ) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(dto: CreateDonorDto): Promise<Donor> {
    // Enforce unique email at service level for clear error message
    const existing = await this.donorRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(
        `A donor with email "${dto.email}" already exists.`,
      );
    }

    // Validate age: donor must be 18–65 years old
    const age = this.calculateAge(new Date(dto.dateOfBirth));
    if (age < 18) {
      throw new BadRequestException('Donor must be at least 18 years old.');
    }
    if (age > 65) {
      throw new BadRequestException('Donor must be 65 years old or younger.');
    }

    const donor = this.donorRepository.create(dto);
    return this.donorRepository.save(donor);
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<Donor[]> {
    return this.donorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Donor> {
    const donor = await this.donorRepository.findOne({
      where: { id },
      relations: ['donations', 'appointments', 'eligibilityChecks'],
    });
    if (!donor) {
      throw new NotFoundException(`Donor with ID "${id}" not found.`);
    }
    return donor;
  }

  // ─── SEARCH / FILTER ───────────────────────────────────────────────────────
  async search(query: SearchDonorDto): Promise<Donor[]> {
    const where: FindOptionsWhere<Donor> = {};

    if (query.bloodGroup) where.bloodGroup = query.bloodGroup;
    if (query.city) where.city = query.city;
    if (query.state) where.state = query.state;
    if (query.name) where.fullName = Like(`%${query.name}%`);

    return this.donorRepository.find({
      where,
      order: { fullName: 'ASC' },
    });
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateDonorDto): Promise<Donor> {
    const donor = await this.findOne(id);

    // If email is being changed, check it's not taken by another donor
    if (dto.email && dto.email !== donor.email) {
      const emailExists = await this.donorRepository.findOne({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException(
          `Email "${dto.email}" is already registered.`,
        );
      }
    }

    // Validate age if dateOfBirth is updated
    if (dto.dateOfBirth) {
      const age = this.calculateAge(new Date(dto.dateOfBirth));
      if (age < 18 || age > 65) {
        throw new BadRequestException('Donor age must be between 18 and 65.');
      }
    }

    Object.assign(donor, dto);
    return this.donorRepository.save(donor);
  }

  // ─── DELETE (Soft deactivate instead of hard delete) ──────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const donor = await this.findOne(id);
    donor.isActive = false;
    await this.donorRepository.save(donor);
    return { message: `Donor "${donor.fullName}" has been deactivated.` };
  }

  // ─── HARD DELETE ──────────────────────────────────────────────────────────
  async hardDelete(id: string): Promise<{ message: string }> {
    const donor = await this.findOne(id);
    await this.donorRepository.remove(donor);
    return { message: `Donor "${donor.fullName}" permanently deleted.` };
  }

  // ─── UPDATE LAST DONATION DATE (called internally after donation) ──────────
  async updateLastDonationDate(donorId: string, date: Date): Promise<void> {
    await this.donorRepository.update(donorId, { lastDonationDate: date });
  }

  // ─── HELPER ───────────────────────────────────────────────────────────────
  calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
}
