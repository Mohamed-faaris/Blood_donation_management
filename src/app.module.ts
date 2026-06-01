import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ─── Feature Modules ──────────────────────────────────────────────────────────
import { DonorModule } from './modules/donor/donor.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { BloodRequestModule } from './modules/blood-request/blood-request.module';
import { DonationModule } from './modules/donation/donation.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { EligibilityModule } from './modules/eligibility/eligibility.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CampModule } from './modules/camp/camp.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { HospitalModule } from './modules/hospital/hospital.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
    
    // Feature Modules
    DonorModule,
    InventoryModule,
    BloodRequestModule,
    DonationModule,
    AppointmentModule,
    EligibilityModule,
    NotificationModule,
    CampModule,
    FeedbackModule,
    AuthModule,
    UserModule,
    HospitalModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}