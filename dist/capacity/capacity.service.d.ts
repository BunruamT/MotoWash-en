import { SupabaseClient } from '@supabase/supabase-js';
import { TimeSlot } from './types/time-slot.type';
export declare class CapacityService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    getAvailability(date: string): Promise<TimeSlot[]>;
}
