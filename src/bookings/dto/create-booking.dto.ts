import { z } from 'zod';

export const createBookingSchema = z.object({
  vehicleId: z.string().uuid(),
  pickupPointId: z.string().uuid(),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  notes: z.string().optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
