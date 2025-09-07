"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().uuid(),
    pickupPointId: zod_1.z.string().uuid(),
    slotDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    slotStart: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=create-booking.dto.js.map