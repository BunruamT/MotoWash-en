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
exports.AdminBookingsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const bookings_service_1 = require("../bookings/bookings.service");
let AdminBookingsController = class AdminBookingsController {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async approve(id) {
        return this.bookingsService.update(id, undefined, { status: 'CONFIRMED' });
    }
    async assignRunner(id, runnerId) {
        throw new Error('Not implemented');
    }
    async updateStatus(id, dto) {
        return this.bookingsService.update(id, undefined, dto);
    }
};
exports.AdminBookingsController = AdminBookingsController;
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/assign-runner'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('runnerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "assignRunner", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "updateStatus", null);
exports.AdminBookingsController = AdminBookingsController = __decorate([
    (0, common_1.Controller)('admin/bookings'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], AdminBookingsController);
//# sourceMappingURL=admin-bookings.controller.js.map