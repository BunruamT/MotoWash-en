import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        role: string;
        lineUserId?: string;
    };
}
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, req: AuthenticatedRequest): Promise<any>;
    findOne(id: string, req: AuthenticatedRequest): Promise<any>;
    update(id: string, dto: UpdateBookingDto, req: AuthenticatedRequest): Promise<any>;
}
export {};
