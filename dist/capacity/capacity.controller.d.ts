import { z } from 'zod';
import { CapacityService } from './capacity.service';
declare const availabilityQuerySchema: z.ZodObject<{
    date: z.ZodString;
}, z.core.$strip>;
export declare class CapacityController {
    private readonly capacityService;
    constructor(capacityService: CapacityService);
    getAvailability(query: z.infer<typeof availabilityQuerySchema>): Promise<import("./types/time-slot.type").TimeSlot[]>;
}
export {};
