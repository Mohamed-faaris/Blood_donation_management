export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
}

export enum DonationStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum AppointmentStatus {
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
}

export enum StockStatus {
  AVAILABLE = 'available',
  LOW = 'low',
  EXPIRED = 'expired',
  RESERVED = 'reserved',
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  DONATION_COMPLETE = 'donation_complete',
  REQUEST_APPROVED = 'request_approved',
  REQUEST_REJECTED = 'request_rejected',
  ELIGIBILITY_ALERT = 'eligibility_alert',
  STOCK_LOW = 'stock_low',
  GENERAL = 'general',
}

export enum CampStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum UrgencyLevel {
  NORMAL = 'normal',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

export enum UserRole {
  ADMIN = 'admin',
  DONOR = 'donor',
  HOSPITAL = 'hospital',
}

export enum HospitalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
