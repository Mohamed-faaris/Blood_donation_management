import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EligibilityCheck } from './eligibility-check.entity';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';
import { DonorService } from '../donor/donor.service';

// ─── Eligibility Constants ─────────────────────────────────────────────────
const MIN_AGE = 18;
const MAX_AGE = 65;
const MIN_WEIGHT_KG = 50;
const MIN_HEMOGLOBIN_MALE = 13.0;   // g/dL
const MIN_HEMOGLOBIN_FEMALE = 12.5; // g/dL
const MIN_DONATION_GAP_DAYS = 90;   // 3 months between donations

@Injectable()
export class EligibilityService {
  constructor(
    @InjectRepository(EligibilityCheck)
    private readonly eligibilityRepository: Repository<EligibilityCheck>,
    private readonly donorService: DonorService,
  ) {}

  async checkEligibility(dto: CheckEligibilityDto): Promise<EligibilityCheck> {
    const donor = await this.donorService.findOne(dto.donorId);
    const failedCriteria: string[] = [];
    const reasons: string[] = [];

    // 1. AGE CHECK
    const age = this.donorService.calculateAge(new Date(donor.dateOfBirth));
    if (age < MIN_AGE) {
      failedCriteria.push('age');
      reasons.push(`Age ${age} is below minimum required age of ${MIN_AGE}.`);
    }
    if (age > MAX_AGE) {
      failedCriteria.push('age');
      reasons.push(`Age ${age} exceeds maximum allowed age of ${MAX_AGE}.`);
    }

    // 2. WEIGHT CHECK
    const weight = dto.weight ?? Number(donor.weight);
    if (weight < MIN_WEIGHT_KG) {
      failedCriteria.push('weight');
      reasons.push(
        `Weight ${weight}kg is below the minimum required ${MIN_WEIGHT_KG}kg.`,
      );
    }

    // 3. HEMOGLOBIN CHECK (depends on gender)
    const minHb =
      donor.gender === 'male' ? MIN_HEMOGLOBIN_MALE : MIN_HEMOGLOBIN_FEMALE;
    if (dto.hemoglobin < minHb) {
      failedCriteria.push('hemoglobin');
      reasons.push(
        `Hemoglobin ${dto.hemoglobin} g/dL is below the minimum of ${minHb} g/dL for ${donor.gender}.`,
      );
    }

    // 4. LAST DONATION GAP CHECK
    let daysSinceLastDonation: number | null = null;
    if (donor.lastDonationDate) {
      const lastDate = new Date(donor.lastDonationDate);
      daysSinceLastDonation = Math.floor(
        (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysSinceLastDonation < MIN_DONATION_GAP_DAYS) {
        failedCriteria.push('donation_gap');
        reasons.push(
          `Only ${daysSinceLastDonation} days since last donation. Minimum gap is ${MIN_DONATION_GAP_DAYS} days.`,
        );
      }
    }

    // 5. MEDICAL CONDITION CHECK
    if (donor.hasMedicalCondition) {
      failedCriteria.push('medical_condition');
      reasons.push(
        'Donor has a reported medical condition that may disqualify them.',
      );
    }

    const isEligible = failedCriteria.length === 0;

    // Persist the eligibility check record
    const check = this.eligibilityRepository.create({
      donorId: donor.id,
      ageAtCheck: age,
      weightAtCheck: weight,
      hemoglobinAtCheck: dto.hemoglobin,
      daysSinceLastDonation,
      isEligible,
      ineligibilityReason: reasons.length > 0 ? reasons.join(' | ') : null,
      failedCriteria: failedCriteria.length > 0 ? failedCriteria : null,
    });

    return this.eligibilityRepository.save(check);
  }

  // ─── GET ELIGIBILITY HISTORY FOR DONOR ────────────────────────────────────
  async getHistory(donorId: string): Promise<EligibilityCheck[]> {
    return this.eligibilityRepository.find({
      where: { donorId },
      order: { checkedAt: 'DESC' },
    });
  }

  // ─── GET LATEST CHECK ─────────────────────────────────────────────────────
  async getLatestCheck(donorId: string): Promise<EligibilityCheck | null> {
    return this.eligibilityRepository.findOne({
      where: { donorId },
      order: { checkedAt: 'DESC' },
    });
  }
}
