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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
let WebhookService = class WebhookService {
    constructor(configService) {
        this.configService = configService;
    }
    verifySignature(body, signature) {
        const channelSecret = this.configService.getOrThrow('LINE_MESSAGING_CHANNEL_SECRET');
        const hash = crypto
            .createHmac('SHA256', channelSecret)
            .update(body)
            .digest('base64');
        return hash === signature;
    }
    async replyMessage(replyToken, messages) {
        const accessToken = this.configService.getOrThrow('LINE_MESSAGING_ACCESS_TOKEN');
        await fetch('https://api.line.me/v2/bot/message/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                replyToken,
                messages,
            }),
        });
    }
    async pushMessage(to, messages) {
        const accessToken = this.configService.getOrThrow('LINE_MESSAGING_ACCESS_TOKEN');
        await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                to,
                messages,
            }),
        });
    }
    buildBookingStatusMessage(booking) {
        return {
            type: 'flex',
            altText: `Booking ${booking.status}`,
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: 'Booking Status Update',
                            weight: 'bold',
                            size: 'xl',
                        },
                    ],
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: `Status: ${booking.status}`,
                            size: 'md',
                        },
                        {
                            type: 'text',
                            text: `Date: ${booking.slot_date}`,
                            size: 'md',
                        },
                        {
                            type: 'text',
                            text: `Time: ${booking.slot_start}`,
                            size: 'md',
                        },
                    ],
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'button',
                            action: {
                                type: 'uri',
                                label: 'View Details',
                                uri: `${this.configService.get('FRONTEND_ORIGIN')}/bookings/${booking.id}`,
                            },
                            style: 'primary',
                        },
                    ],
                },
            },
        };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map