import { z } from 'zod';

export const updateBookingSchema = z.object({
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  slotStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  status: z.enum([
    'PENDING_CONFIRM',
    'CONFIRMED',
    'PICKUP_ASSIGNED',
    'PICKED_UP',
    'IN_WASH',
    'READY_FOR_RETURN',
    'ON_THE_WAY_RETURN',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
  ]).optional(),
  cancellationReason: z.string().optional(),
});

export type UpdateBookingDto = z.infer<typeof updateBookingSchema>;
