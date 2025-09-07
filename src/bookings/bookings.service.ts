import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.constants';
import { CapacityService } from '../capacity/capacity.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly capacityService: CapacityService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    // Check capacity
    const availability = await this.capacityService.getAvailability(dto.slotDate);
    const slot = availability.find(s => s.time === dto.slotStart);
    
    if (!slot || slot.availableSlots === 0) {
      throw new BadRequestException('Selected time slot is not available');
    }

    // Create booking
    const { data: booking, error } = await this.supabase
      .from('bookings')
      .insert([{
        user_id: userId,
        vehicle_id: dto.vehicleId,
        pickup_point_id: dto.pickupPointId,
        slot_date: dto.slotDate,
        slot_start: dto.slotStart,
        slot_end: new Date(
          new Date(`${dto.slotDate}T${dto.slotStart}`).getTime() + 60 * 60 * 1000
        ).toTimeString().split(' ')[0],
        status: 'PENDING_CONFIRM',
        notes: dto.notes,
      }])
      .select()
      .single();

    if (error) throw error;
    return booking;
  }

  async findOne(id: string, userId?: string) {
    const query = this.supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(*),
        pickup_point:pickup_points(*),
        payments(*),
        jobs(*)
      `)
      .eq('id', id);

    // If userId provided, check ownership
    if (userId) {
      query.eq('user_id', userId);
    }

    const { data: booking, error } = await query.single();

    if (error || !booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, userId: string | undefined, dto: UpdateBookingDto) {
    const booking = await this.findOne(id, userId);

    // Check reschedule policy
    if (dto.slotDate && dto.slotStart) {
      const slotDateTime = new Date(`${booking.slot_date}T${booking.slot_start}`);
      const minutesUntilSlot = (slotDateTime.getTime() - Date.now()) / (1000 * 60);

      if (minutesUntilSlot <= 60) {
        throw new BadRequestException('Cannot reschedule less than 60 minutes before slot');
      }

      // Check new slot availability
      const availability = await this.capacityService.getAvailability(dto.slotDate);
      const slot = availability.find(s => s.time === dto.slotStart);
      
      if (!slot || slot.availableSlots === 0) {
        throw new BadRequestException('Selected time slot is not available');
      }
    }

    // Update booking
    const { data: updatedBooking, error } = await this.supabase
      .from('bookings')
      .update({
        slot_date: dto.slotDate,
        slot_start: dto.slotStart,
        slot_end: dto.slotStart ? new Date(
          new Date(`${dto.slotDate}T${dto.slotStart}`).getTime() + 60 * 60 * 1000
        ).toTimeString().split(' ')[0] : undefined,
        status: dto.status,
        cancellation_reason: dto.cancellationReason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedBooking;
  }
}
