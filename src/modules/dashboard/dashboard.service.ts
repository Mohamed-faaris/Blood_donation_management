import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donor } from '../donor/donor.entity';
import { BloodInventory } from '../inventory/blood-inventory.entity';
import { BloodRequest } from '../blood-request/blood-request.entity';
import { Donation } from '../donation/donation.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Camp } from '../camp/camp.entity';
import { RequestStatus, DonationStatus, AppointmentStatus, CampStatus, StockStatus } from '../../common/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
    @InjectRepository(BloodInventory)
    private readonly inventoryRepository: Repository<BloodInventory>,
    @InjectRepository(BloodRequest)
    private readonly requestRepository: Repository<BloodRequest>,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Camp)
    private readonly campRepository: Repository<Camp>,
  ) {}

  async getStats() {
    // ── Donor stats ───────────────────────────────────────────────────────
    const totalDonors = await this.donorRepository.count();
    const activeDonors = await this.donorRepository.count({ where: { isActive: true } });

    // ── Inventory: group-wise summary ─────────────────────────────────────
    const inventory = await this.inventoryRepository.find({ order: { bloodGroup: 'ASC' } });
    const totalBloodUnits = inventory.reduce((sum, r) => sum + r.quantityUnits, 0);
    const lowStockGroups = inventory
      .filter((r) => r.status === StockStatus.LOW)
      .map((r) => ({ bloodGroup: r.bloodGroup, units: r.quantityUnits }));

    const inventoryByGroup = inventory.map((r) => ({
      bloodGroup: r.bloodGroup,
      units: r.quantityUnits,
      status: r.status,
    }));

    // ── Request stats ─────────────────────────────────────────────────────
    const totalRequests = await this.requestRepository.count();
    const pendingRequests = await this.requestRepository.count({
      where: { status: RequestStatus.PENDING },
    });
    const approvedRequests = await this.requestRepository.count({
      where: { status: RequestStatus.APPROVED },
    });
    const fulfilledRequests = await this.requestRepository.count({
      where: { status: RequestStatus.FULFILLED },
    });

    // ── Donation stats ────────────────────────────────────────────────────
    const totalDonations = await this.donationRepository.count();
    const completedDonations = await this.donationRepository.count({
      where: { status: DonationStatus.COMPLETED },
    });

    // Monthly donations (current calendar month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyDonations = await this.donationRepository
      .createQueryBuilder('d')
      .where('d.donationDate >= :startOfMonth', { startOfMonth })
      .andWhere('d.status = :status', { status: DonationStatus.COMPLETED })
      .getCount();

    // Monthly donations per last 6 months (trend)
    const monthlyTrend = await this.getMonthlyDonationTrend();

    // ── Appointment stats ─────────────────────────────────────────────────
    const upcomingAppointments = await this.appointmentRepository.count({
      where: { status: AppointmentStatus.BOOKED },
    });

    // ── Camp stats ────────────────────────────────────────────────────────
    const upcomingCamps = await this.campRepository.count({
      where: { status: CampStatus.UPCOMING },
    });

    return {
      donors: {
        total: totalDonors,
        active: activeDonors,
        inactive: totalDonors - activeDonors,
      },
      inventory: {
        totalUnits: totalBloodUnits,
        byBloodGroup: inventoryByGroup,
        lowStockAlerts: lowStockGroups,
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        fulfilled: fulfilledRequests,
      },
      donations: {
        total: totalDonations,
        completed: completedDonations,
        thisMonth: monthlyDonations,
        monthlyTrend,
      },
      appointments: {
        upcoming: upcomingAppointments,
      },
      camps: {
        upcoming: upcomingCamps,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  // ── Monthly trend: last 6 months ─────────────────────────────────────────
  private async getMonthlyDonationTrend(): Promise<
    { month: string; count: number }[]
  > {
    const results = await this.donationRepository
      .createQueryBuilder('d')
      .select("TO_CHAR(d.donationDate, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('d.donationDate >= NOW() - INTERVAL \'6 months\'')
      .andWhere('d.status = :status', { status: DonationStatus.COMPLETED })
      .groupBy("TO_CHAR(d.donationDate, 'YYYY-MM')")
      .orderBy("TO_CHAR(d.donationDate, 'YYYY-MM')", 'ASC')
      .getRawMany();

    return results.map((r) => ({
      month: r.month,
      count: parseInt(r.count, 10),
    }));
  }
}
