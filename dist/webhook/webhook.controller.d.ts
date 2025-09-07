import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handleLineWebhook(signature: string, body: any): Promise<{
        success: boolean;
    }>;
}
