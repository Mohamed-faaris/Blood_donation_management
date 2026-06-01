import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DonorService } from '../donor/donor.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { AppointmentStatus } from '../../common/enums';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly donorService: DonorService,
    private readonly eligibilityService: EligibilityService,
  ) {}

  // ─── BOOK APPOINTMENT ─────────────────────────────────────────────────────
  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    // 1. Verify donor exists
    const donor = await this.donorService.findOne(dto.donorId);

    // 2. Business Rule: Donor must be eligible before booking
    const latestCheck = await this.eligibilityService.getLatestCheck(donor.id);
    if (!latestCheck || !latestCheck.isEligible) {
      throw new BadRequestException(
        'Appointment cannot be created for an ineligible donor. ' +
          'Please complete an eligibility check first.',
      );
    }

    // 3. Scheduled date must be in the future
    const scheduled = new Date(dto.scheduledDate);
    if (scheduled <= new Date()) {
      throw new BadRequestException(
        'Appointment must be scheduled for a future date and time.',
      );
    }

    // 4. Check for duplicate active appointment on same date for same donor
    const existingOnDate = await this.appointmentRepository
      .createQueryBuilder('appt')
      .where('appt.donorId = :donorId', { donorId: dto.donorId })
      .andWhere('DATE(appt.scheduledDate) = DATE(:date)', { date: scheduled })
      .andWhere('appt.status NOT IN (:...excluded)', {
        excluded: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      })
      .getOne();

    if (existingOnDate) {
      throw new BadRequestException(
        'Donor already has an active appointment on that date.',
      );
    }

    const appointment = this.appointmentRepository.create({
      ...dto,
      scheduledDate: scheduled,
    });
    return this.appointmentRepository.save(appointment);
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['donor'],
      order: { scheduledDate: 'ASC' },
    });
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Appointment> {
    const appt = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['donor'],
    });
    if (!appt) {
      throw new NotFoundException(`Appointment with ID "${id}" not found.`);
    }
    return appt;
  }

  // ─── GET BY DONOR ──────────────────────────────────────────────────────────
  async findByDonor(donorId: string): Promise<Appointment[]> {
    await this.donorService.findOne(donorId); // Validates donor exists
    return this.appointmentRepository.find({
      where: { donorId },
      order: { scheduledDate: 'DESC' },
    });
  }

  // ─── UPDATE (Reschedule / Cancel / Mark Complete) ─────────────────────────
  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appt = await this.findOne(id);

    // Guard: cannot update a completed or cancelled appointment
    if (
      appt.status === AppointmentStatus.COMPLETED ||
      appt.status === AppointmentStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot update an appointment that is already "${appt.status}".`,
      );
    }

    // Handle reschedule
    if (dto.scheduledDate) {
      const newDate = new Date(dto.scheduledDate);
      if (newDate <= new Date()) {
        throw new BadRequestException(
          'Rescheduled date must be in the future.',
        );
      }
      appt.rescheduledDate = newDate;
      appt.scheduledDate = newDate;
      appt.status = AppointmentStatus.RESCHEDULED;
    }

    // Handle cancellation
    if (dto.status === AppointmentStatus.CANCELLED) {
      if (!dto.cancellationReason) {
        throw new BadRequestException(
          'A cancellation reason is required.',
        );
      }
      appt.cancellationReason = dto.cancellationReason;
    }

    if (dto.status) appt.status = dto.status;
    if (dto.notes) appt.notes = dto.notes;

    return this.appointmentRepository.save(appt);
  }

  // ─── UPCOMING APPOINTMENTS ─────────────────────────────────────────────────
  async findUpcoming(): Promise<Appointment[]> {
    return this.appointmentRepository
      .createQueryBuilder('appt')
      .leftJoinAndSelect('appt.donor', 'donor')
      .where('appt.scheduledDate > :now', { now: new Date() })
      .andWhere('appt.status = :status', { status: AppointmentStatus.BOOKED })
      .orderBy('appt.scheduledDate', 'ASC')
      .getMany();
  }
}
