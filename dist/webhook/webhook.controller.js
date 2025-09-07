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
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const webhook_service_1 = require("./webhook.service");
let WebhookController = class WebhookController {
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    async handleLineWebhook(signature, body) {
        const stringBody = JSON.stringify(body);
        if (!this.webhookService.verifySignature(stringBody, signature)) {
            throw new common_1.UnauthorizedException('Invalid LINE signature');
        }
        for (const event of body.events) {
            switch (event.type) {
                case 'follow':
                    await this.webhookService.replyMessage(event.replyToken, [{
                            type: 'text',
                            text: 'Thanks for following MotoWash! 🏍️ Use our LIFF app to book your wash.',
                        }]);
                    break;
                case 'message':
                    if (event.message.type === 'text') {
                        await this.webhookService.replyMessage(event.replyToken, [{
                                type: 'text',
                                text: 'Please use our LIFF app to manage your bookings.',
                            }]);
                    }
                    break;
                case 'postback':
                    const data = new URLSearchParams(event.postback.data);
                    switch (data.get('action')) {
                        case 'confirm_pickup':
                            await this.webhookService.replyMessage(event.replyToken, [{
                                    type: 'text',
                                    text: 'Thank you for confirming pickup! 👍',
                                }]);
                            break;
                    }
                    break;
            }
        }
        return { success: true };
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('line'),
    __param(0, (0, common_1.Headers)('x-line-signature')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleLineWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('webhook'),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map