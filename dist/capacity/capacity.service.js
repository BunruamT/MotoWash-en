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
exports.CapacityService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_constants_1 = require("../database/supabase.constants");
let CapacityService = class CapacityService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getAvailability(date) {
        const dayOfWeek = new Date(date).getDay();
        const { data: businessHours } = await this.supabase
            .from('business_hours')
            .select('open_time, close_time')
            .eq('day_of_week', dayOfWeek)
            .single();
        if (!businessHours) {
            return [];
        }
        const { data: specialClosure } = await this.supabase
            .from('special_closures')
            .select('*')
            .eq('date', date)
            .single();
        if (specialClosure) {
            return [];
        }
        const { data: capacitySlots } = await this.supabase
            .from('capacity_slots')
            .select('time_slot, max_bookings')
            .eq('day_of_week', dayOfWeek)
            .gte('time_slot', businessHours.open_time)
            .lte('time_slot', businessHours.close_time)
            .order('time_slot');
        const { data: bookings } = await this.supabase
            .from('bookings')
            .select('slot_start, slot_end')
            .eq('slot_date', date)
            .in('status', ['PENDING_CONFIRM', 'CONFIRMED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'IN_WASH']);
        return (capacitySlots || []).map(slot => {
            const bookedCount = (bookings === null || bookings === void 0 ? void 0 : bookings.filter(booking => booking.slot_start <= slot.time_slot && booking.slot_end > slot.time_slot).length) || 0;
            return {
                time: slot.time_slot,
                availableSlots: Math.max(0, slot.max_bookings - bookedCount),
                maxSlots: slot.max_bookings,
            };
        });
    }
};
exports.CapacityService = CapacityService;
exports.CapacityService = CapacityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_constants_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], CapacityService);
//# sourceMappingURL=capacity.service.js.map