import { z } from 'zod';
export declare const createBookingSchema: z.ZodObject<{
    vehicleId: z.ZodString;
    pickupPointId: z.ZodString;
    slotDate: z.ZodString;
    slotStart: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateBookingDto = z.infer<typeof createBookingSchema>;
