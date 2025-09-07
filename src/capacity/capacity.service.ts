import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.constants';
import { TimeSlot } from './types/time-slot.type';

@Injectable()
export class CapacityService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async getAvailability(date: string): Promise<TimeSlot[]> {
    const dayOfWeek = new Date(date).getDay();

    // Get business hours for this day
    const { data: businessHours } = await this.supabase
      .from('business_hours')
      .select('open_time, close_time')
      .eq('day_of_week', dayOfWeek)
      .single();

    if (!businessHours) {
      return []; // Not a business day
    }

    // Check for special closures
    const { data: specialClosure } = await this.supabase
      .from('special_closures')
      .select('*')
      .eq('date', date)
      .single();

    if (specialClosure) {
      return []; // Closed for special reason
    }

    // Get capacity slots for this day
    const { data: capacitySlots } = await this.supabase
      .from('capacity_slots')
      .select('time_slot, max_bookings')
      .eq('day_of_week', dayOfWeek)
      .gte('time_slot', businessHours.open_time)
      .lte('time_slot', businessHours.close_time)
      .order('time_slot');

    // Get existing bookings for this date
    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('slot_start, slot_end')
      .eq('slot_date', date)
      .in('status', ['PENDING_CONFIRM', 'CONFIRMED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'IN_WASH']);

    // Calculate availability for each time slot
    return (capacitySlots || []).map(slot => {
      const bookedCount = bookings?.filter(booking => 
        booking.slot_start <= slot.time_slot && booking.slot_end > slot.time_slot
      ).length || 0;

      return {
        time: slot.time_slot,
        availableSlots: Math.max(0, slot.max_bookings - bookedCount),
        maxSlots: slot.max_bookings,
      };
    });
  }
}
