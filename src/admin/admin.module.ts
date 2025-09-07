import { Module } from '@nestjs/common';
import { AdminBookingsController } from './admin-bookings.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [AdminBookingsController],
})
export class AdminModule {}
