import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebhookService {
  constructor(private readonly configService: ConfigService) {}

  verifySignature(body: string, signature: string): boolean {
    const channelSecret = this.configService.getOrThrow('LINE_MESSAGING_CHANNEL_SECRET');
    const hash = crypto
      .createHmac('SHA256', channelSecret)
      .update(body)
      .digest('base64');
    return hash === signature;
  }

  async replyMessage(replyToken: string, messages: any[]): Promise<void> {
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

  async pushMessage(to: string, messages: any[]): Promise<void> {
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

  // Helper method to build Flex Message for booking status
  buildBookingStatusMessage(booking: any) {
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
}
