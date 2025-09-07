import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BookingsService } from '../bookings/bookings.service';
import { UpdateBookingDto } from '../bookings/dto/update-booking.dto';

@Controller('admin/bookings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    return this.bookingsService.update(id, undefined, { status: 'CONFIRMED' });
  }

  @Post(':id/assign-runner')
  async assignRunner(
    @Param('id') id: string,
    @Body('runnerId') runnerId: string,
  ) {
    // Update runner assignment in jobs table
    // This would typically create a new job record
    throw new Error('Not implemented');
  }

  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, undefined, dto);
  }
}
