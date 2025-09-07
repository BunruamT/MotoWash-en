import { BookingsService } from '../bookings/bookings.service';
import { UpdateBookingDto } from '../bookings/dto/update-booking.dto';
export declare class AdminBookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    approve(id: string): Promise<any>;
    assignRunner(id: string, runnerId: string): Promise<void>;
    updateStatus(id: string, dto: UpdateBookingDto): Promise<any>;
}
