"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingSchema = void 0;
const zod_1 = require("zod");
exports.updateBookingSchema = zod_1.z.object({
    slotDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    slotStart: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    status: zod_1.z.enum([
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
    cancellationReason: zod_1.z.string().optional(),
});
//# sourceMappingURL=update-booking.dto.js.map