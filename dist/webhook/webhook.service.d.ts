import { ConfigService } from '@nestjs/config';
export declare class WebhookService {
    private readonly configService;
    constructor(configService: ConfigService);
    verifySignature(body: string, signature: string): boolean;
    replyMessage(replyToken: string, messages: any[]): Promise<void>;
    pushMessage(to: string, messages: any[]): Promise<void>;
    buildBookingStatusMessage(booking: any): {
        type: string;
        altText: string;
        contents: {
            type: string;
            header: {
                type: string;
                layout: string;
                contents: {
                    type: string;
                    text: string;
                    weight: string;
                    size: string;
                }[];
            };
            body: {
                type: string;
                layout: string;
                contents: {
                    type: string;
                    text: string;
                    size: string;
                }[];
            };
            footer: {
                type: string;
                layout: string;
                contents: {
                    type: string;
                    action: {
                        type: string;
                        label: string;
                        uri: string;
                    };
                    style: string;
                }[];
            };
        };
    };
}
