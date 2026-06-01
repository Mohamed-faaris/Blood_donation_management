import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Donation } from './donation.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { DonorService } from '../donor/donor.service';
import { InventoryService } from '../inventory/inventory.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { DonationStatus } from '../../common/enums';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    private readonly donorService: DonorService,
    private readonly inventoryService: InventoryService,
    private readonly eligibilityService: EligibilityService,
    private readonly dataSource: DataSource,
  ) {}

  // ─── RECORD DONATION (Transactional) ──────────────────────────────────────
  async create(dto: CreateDonationDto): Promise<Donation> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Verify donor exists
      const donor = await this.donorService.findOne(dto.donorId);

      // 2. Check latest eligibility — donor must have a passing eligibility check
      const latestCheck = await this.eligibilityService.getLatestCheck(donor.id);
      if (!latestCheck || !latestCheck.isEligible) {
        throw new BadRequestException(
          'Donor does not have a valid eligibility clearance. ' +
            'Please run an eligibility check first.',
        );
      }

      // 3. Verify blood group matches donor's blood group
      if (dto.bloodGroup !== donor.bloodGroup) {
        throw new BadRequestException(
          `Blood group mismatch: donor is "${donor.bloodGroup}" but donation says "${dto.bloodGroup}".`,
        );
      }

      // 4. Calculate expiry date (blood expires in 42 days)
      const donationDate = new Date(dto.donationDate);
      const expiryDate = new Date(donationDate);
      expiryDate.setDate(expiryDate.getDate() + 42);

      // 5. Save the donation record
      const donation = manager.create(Donation, {
        ...dto,
        expiryDate,
        status: DonationStatus.COMPLETED,
        isAddedToInventory: false,
      });
      const saved = await manager.save(Donation, donation);

      // 6. Add donated blood to inventory
      await this.inventoryService.addStock({
        bloodGroup: dto.bloodGroup,
        units: dto.unitsdonated ?? 1,
      });

      // 7. Mark as added to inventory
      saved.isAddedToInventory = true;
      await manager.save(Donation, saved);

      // 8. Update donor's last donation date
      await this.donorService.updateLastDonationDate(donor.id, donationDate);

      return saved;
    });
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<Donation[]> {
    return this.donationRepository.find({
      relations: ['donor'],
      order: { donationDate: 'DESC' },
    });
  }

  // ─── GET ONE ───────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Donation> {
    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: ['donor'],
    });
    if (!donation) {
      throw new NotFoundException(`Donation with ID "${id}" not found.`);
    }
    return donation;
  }

  // ─── GET BY DONOR ──────────────────────────────────────────────────────────
  async findByDonor(donorId: string): Promise<Donation[]> {
    // Verify donor exists first
    await this.donorService.findOne(donorId);
    return this.donationRepository.find({
      where: { donorId },
      order: { donationDate: 'DESC' },
    });
  }

  // ─── CANCEL DONATION ───────────────────────────────────────────────────────
  async cancel(id: string): Promise<Donation> {
    const donation = await this.findOne(id);

    if (donation.status === DonationStatus.CANCELLED) {
      throw new BadRequestException('Donation is already cancelled.');
    }

    // If blood was already added to inventory, remove it back
    if (donation.isAddedToInventory) {
      await this.inventoryService.issueStock({
        bloodGroup: donation.bloodGroup,
        units: donation.unitsdonated,
        issuedTo: 'CANCELLED_DONATION_REVERSAL',
      });
      donation.isAddedToInventory = false;
    }

    donation.status = DonationStatus.CANCELLED;
    return this.donationRepository.save(donation);
  }

  // ─── DONATION STATS ────────────────────────────────────────────────────────
  async getStats(): Promise<{
    total: number;
    completed: number;
    cancelled: number;
    thisMonth: number;
  }> {
    const total = await this.donationRepository.count();
    const completed = await this.donationRepository.count({
      where: { status: DonationStatus.COMPLETED },
    });
    const cancelled = await this.donationRepository.count({
      where: { status: DonationStatus.CANCELLED },
    });

    // Donations this calendar month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = await this.donationRepository
      .createQueryBuilder('donation')
      .where('donation.donationDate >= :startOfMonth', { startOfMonth })
      .andWhere('donation.status = :status', { status: DonationStatus.COMPLETED })
      .getCount();

    return { total, completed, cancelled, thisMonth };
  }
}
