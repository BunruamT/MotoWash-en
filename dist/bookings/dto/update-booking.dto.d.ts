import { z } from 'zod';
export declare const updateBookingSchema: z.ZodObject<{
    slotDate: z.ZodOptional<z.ZodString>;
    slotStart: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING_CONFIRM: "PENDING_CONFIRM";
        CONFIRMED: "CONFIRMED";
        PICKUP_ASSIGNED: "PICKUP_ASSIGNED";
        PICKED_UP: "PICKED_UP";
        IN_WASH: "IN_WASH";
        READY_FOR_RETURN: "READY_FOR_RETURN";
        ON_THE_WAY_RETURN: "ON_THE_WAY_RETURN";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        NO_SHOW: "NO_SHOW";
    }>>;
    cancellationReason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateBookingDto = z.infer<typeof updateBookingSchema>;
