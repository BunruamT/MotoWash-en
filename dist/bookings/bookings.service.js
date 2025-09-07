"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_constants_1 = require("../database/supabase.constants");
const capacity_service_1 = require("../capacity/capacity.service");
let BookingsService = class BookingsService {
    constructor(supabase, capacityService) {
        this.supabase = supabase;
        this.capacityService = capacityService;
    }
    async create(userId, dto) {
        const availability = await this.capacityService.getAvailability(dto.slotDate);
        const slot = availability.find(s => s.time === dto.slotStart);
        if (!slot || slot.availableSlots === 0) {
            throw new common_1.BadRequestException('Selected time slot is not available');
        }
        const { data: booking, error } = await this.supabase
            .from('bookings')
            .insert([{
                user_id: userId,
                vehicle_id: dto.vehicleId,
                pickup_point_id: dto.pickupPointId,
                slot_date: dto.slotDate,
                slot_start: dto.slotStart,
                slot_end: new Date(new Date(`${dto.slotDate}T${dto.slotStart}`).getTime() + 60 * 60 * 1000).toTimeString().split(' ')[0],
                status: 'PENDING_CONFIRM',
                notes: dto.notes,
            }])
            .select()
            .single();
        if (error)
            throw error;
        return booking;
    }
    async findOne(id, userId) {
        const query = this.supabase
            .from('bookings')
            .select(`
        *,
        vehicle:vehicles(*),
        pickup_point:pickup_points(*),
        payments(*),
        jobs(*)
      `)
            .eq('id', id);
        if (userId) {
            query.eq('user_id', userId);
        }
        const { data: booking, error } = await query.single();
        if (error || !booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async update(id, userId, dto) {
        const booking = await this.findOne(id, userId);
        if (dto.slotDate && dto.slotStart) {
            const slotDateTime = new Date(`${booking.slot_date}T${booking.slot_start}`);
            const minutesUntilSlot = (slotDateTime.getTime() - Date.now()) / (1000 * 60);
            if (minutesUntilSlot <= 60) {
                throw new common_1.BadRequestException('Cannot reschedule less than 60 minutes before slot');
            }
            const availability = await this.capacityService.getAvailability(dto.slotDate);
            const slot = availability.find(s => s.time === dto.slotStart);
            if (!slot || slot.availableSlots === 0) {
                throw new common_1.BadRequestException('Selected time slot is not available');
            }
        }
        const { data: updatedBooking, error } = await this.supabase
            .from('bookings')
            .update({
            slot_date: dto.slotDate,
            slot_start: dto.slotStart,
            slot_end: dto.slotStart ? new Date(new Date(`${dto.slotDate}T${dto.slotStart}`).getTime() + 60 * 60 * 1000).toTimeString().split(' ')[0] : undefined,
            status: dto.status,
            cancellation_reason: dto.cancellationReason,
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return updatedBooking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_constants_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        capacity_service_1.CapacityService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map