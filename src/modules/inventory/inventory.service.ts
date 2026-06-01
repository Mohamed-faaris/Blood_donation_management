import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BloodInventory } from './blood-inventory.entity';
import { AddStockDto } from './dto/add-stock.dto';
import { IssueStockDto } from './dto/issue-stock.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { BloodGroup, StockStatus } from '../../common/enums';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(BloodInventory)
    private readonly inventoryRepository: Repository<BloodInventory>,
    private readonly dataSource: DataSource,
  ) {}

  // ─── INITIALIZE ALL BLOOD GROUPS ON STARTUP ───────────────────────────────
  async initializeInventory(): Promise<void> {
    for (const bg of Object.values(BloodGroup)) {
      const exists = await this.inventoryRepository.findOne({
        where: { bloodGroup: bg },
      });
      if (!exists) {
        await this.inventoryRepository.save(
          this.inventoryRepository.create({ bloodGroup: bg }),
        );
      }
    }
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  async findAll(): Promise<BloodInventory[]> {
    return this.inventoryRepository.find({ order: { bloodGroup: 'ASC' } });
  }

  // ─── GET LOW STOCK ────────────────────────────────────────────────────────
  async getLowStock(): Promise<{ total: number; alerts: BloodInventory[] }> {
    const alerts = await this.inventoryRepository.find({
      where: { status: StockStatus.LOW },
      order: { quantityUnits: 'ASC' },
    });
    return { total: alerts.length, alerts };
  }

  // ─── GET BY BLOOD GROUP ────────────────────────────────────────────────────
  async findByBloodGroup(bloodGroup: BloodGroup): Promise<BloodInventory> {
    const record = await this.inventoryRepository.findOne({
      where: { bloodGroup },
    });
    if (!record) {
      throw new NotFoundException(
        `Inventory record for blood group "${bloodGroup}" not found.`,
      );
    }
    return record;
  }

  // ─── ADD STOCK (Transactional) ────────────────────────────────────────────
  async addStock(dto: AddStockDto): Promise<BloodInventory> {
    return this.dataSource.transaction(async (manager) => {
      const record = await manager.findOne(BloodInventory, {
        where: { bloodGroup: dto.bloodGroup },
        lock: { mode: 'pessimistic_write' },
      });
      if (!record) {
        throw new NotFoundException(
          `Inventory for blood group "${dto.bloodGroup}" not found.`,
        );
      }
      record.quantityUnits += dto.units;
      record.totalDonated += dto.units;
      record.lastUpdatedDate = new Date();
      record.status = this.resolveStatus(record.quantityUnits, record.minimumThreshold);
      return manager.save(BloodInventory, record);
    });
  }

  // ─── ISSUE STOCK (Transactional) ──────────────────────────────────────────
  async issueStock(dto: IssueStockDto): Promise<BloodInventory> {
    return this.dataSource.transaction(async (manager) => {
      const record = await manager.findOne(BloodInventory, {
        where: { bloodGroup: dto.bloodGroup },
        lock: { mode: 'pessimistic_write' },
      });
      if (!record) {
        throw new NotFoundException(
          `Inventory for blood group "${dto.bloodGroup}" not found.`,
        );
      }
      if (record.quantityUnits < dto.units) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${record.quantityUnits} units of ${dto.bloodGroup}. Requested: ${dto.units} units.`,
        );
      }
      if (record.status === StockStatus.EXPIRED) {
        throw new BadRequestException(
          `Blood group "${dto.bloodGroup}" stock is marked as EXPIRED and cannot be issued.`,
        );
      }
      record.quantityUnits -= dto.units;
      record.totalIssued += dto.units;
      record.lastUpdatedDate = new Date();
      record.status = this.resolveStatus(record.quantityUnits, record.minimumThreshold);
      return manager.save(BloodInventory, record);
    });
  }

  // ─── MARK EXPIRED ─────────────────────────────────────────────────────────
  async markExpired(bloodGroup: BloodGroup, units: number): Promise<BloodInventory> {
    return this.dataSource.transaction(async (manager) => {
      const record = await manager.findOne(BloodInventory, {
        where: { bloodGroup },
        lock: { mode: 'pessimistic_write' },
      });
      if (!record) {
        throw new NotFoundException(`Inventory for "${bloodGroup}" not found.`);
      }
      if (record.quantityUnits < units) {
        throw new BadRequestException(
          `Cannot expire ${units} units. Only ${record.quantityUnits} available.`,
        );
      }
      record.quantityUnits -= units;
      record.totalExpired += units;
      record.lastUpdatedDate = new Date();
      record.status = this.resolveStatus(record.quantityUnits, record.minimumThreshold);
      return manager.save(BloodInventory, record);
    });
  }

  // ─── UPDATE THRESHOLD / STATUS ────────────────────────────────────────────
  async update(bloodGroup: BloodGroup, dto: UpdateInventoryDto): Promise<BloodInventory> {
    const record = await this.findByBloodGroup(bloodGroup);
    Object.assign(record, dto);
    if (dto.minimumThreshold !== undefined) {
      record.status = this.resolveStatus(record.quantityUnits, dto.minimumThreshold);
    }
    return this.inventoryRepository.save(record);
  }

  // ─── CHECK AVAILABILITY ───────────────────────────────────────────────────
  async checkAvailability(bloodGroup: BloodGroup, units: number): Promise<boolean> {
    const record = await this.findByBloodGroup(bloodGroup);
    return record.quantityUnits >= units && record.status !== StockStatus.EXPIRED;
  }

  // ─── PRIVATE: Resolve status from quantity vs threshold ───────────────────
  private resolveStatus(qty: number, threshold: number): StockStatus {
    if (qty === 0) return StockStatus.LOW;
    if (qty <= threshold) return StockStatus.LOW;
    return StockStatus.AVAILABLE;
  }
}
