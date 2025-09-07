import { SupabaseClient } from '@supabase/supabase-js';
import { CapacityService } from '../capacity/capacity.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsService {
    private readonly supabase;
    private readonly capacityService;
    constructor(supabase: SupabaseClient, capacityService: CapacityService);
    create(userId: string, dto: CreateBookingDto): Promise<any>;
    findOne(id: string, userId?: string): Promise<any>;
    update(id: string, userId: string | undefined, dto: UpdateBookingDto): Promise<any>;
}
