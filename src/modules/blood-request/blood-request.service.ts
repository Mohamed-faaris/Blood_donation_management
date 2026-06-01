import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodRequest } from './blood-request.entity';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { InventoryService } from '../inventory/inventory.service';
import { RequestStatus } from '../../common/enums';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectRepository(BloodRequest)
    private readonly requestRepository: Repository<BloodRequest>,
    private readonly inventoryService: InventoryService,
  ) {}

  // ─── CREATE REQUEST ────────────────────────────────────────────────────────
  async create(dto: CreateBloodRequestDto): Promise<BloodRequest> {
    // Validate requiredByDate is in the future
    const requiredDate = new Date(dto.requiredByDate);
    if (requiredDate < new Date()) {
      throw new BadRequestException(
        'Required-by date must be a future date.',
      );
    }

    const request = this.requestRepository.create(dto);
    return this.requestRepository.save(request);
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<BloodRequest[]> {
    return this.requestRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['requestedByDonor'],
    });
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<BloodRequest> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['requestedByDonor'],
    });
    if (!request) {
      throw new NotFoundException(`Blood request with ID "${id}" not found.`);
    }
    return request;
  }

  // ─── GET BY STATUS ─────────────────────────────────────────────────────────
  async findByStatus(status: RequestStatus): Promise<BloodRequest[]> {
    return this.requestRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── UPDATE STATUS (Approve / Reject / Fulfil) ────────────────────────────
  async updateStatus(
    id: string,
    dto: UpdateRequestStatusDto,
  ): Promise<BloodRequest> {
    const request = await this.findOne(id);

    // Guard: Cannot change a cancelled or fulfilled request
    if (
      request.status === RequestStatus.CANCELLED ||
      request.status === RequestStatus.FULFILLED
    ) {
      throw new BadRequestException(
        `Cannot update a request that is already "${request.status}".`,
      );
    }

    // Business Rule: Check stock before approval
    if (dto.status === RequestStatus.APPROVED) {
      const unitsToApprove = dto.unitsApproved ?? request.unitsRequired;

      const hasStock = await this.inventoryService.checkAvailability(
        request.bloodGroup,
        unitsToApprove,
      );

      if (!hasStock) {
        throw new BadRequestException(
          `Insufficient stock of "${request.bloodGroup}" to approve ${unitsToApprove} unit(s).`,
        );
      }

      request.unitsApproved = unitsToApprove;
      request.approvedAt = new Date();
    }

    if (dto.status === RequestStatus.REJECTED) {
      if (!dto.rejectionReason) {
        throw new BadRequestException(
          'A rejection reason is required when rejecting a request.',
        );
      }
      request.rejectionReason = dto.rejectionReason;
    }

    if (dto.status === RequestStatus.FULFILLED) {
      if (request.status !== RequestStatus.APPROVED) {
        throw new BadRequestException(
          'Only approved requests can be marked as fulfilled.',
        );
      }
      // Deduct from inventory when fulfilled
      await this.inventoryService.issueStock({
        bloodGroup: request.bloodGroup,
        units: request.unitsApproved,
        issuedTo: request.patientName,
      });
      request.fulfilledAt = new Date();
    }

    request.status = dto.status;
    return this.requestRepository.save(request);
  }

  // ─── CANCEL ────────────────────────────────────────────────────────────────
  async cancel(id: string): Promise<BloodRequest> {
    const request = await this.findOne(id);
    if (
      request.status === RequestStatus.FULFILLED ||
      request.status === RequestStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Request is already "${request.status}" and cannot be cancelled.`,
      );
    }
    request.status = RequestStatus.CANCELLED;
    return this.requestRepository.save(request);
  }
}
