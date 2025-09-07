import { Controller, Post, Headers, Body, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('line')
  async handleLineWebhook(
    @Headers('x-line-signature') signature: string,
    @Body() body: any,
  ) {
    // Verify LINE signature
    const stringBody = JSON.stringify(body);
    if (!this.webhookService.verifySignature(stringBody, signature)) {
      throw new UnauthorizedException('Invalid LINE signature');
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
            // Handle text messages
            await this.webhookService.replyMessage(event.replyToken, [{
              type: 'text',
              text: 'Please use our LIFF app to manage your bookings.',
            }]);
          }
          break;

        case 'postback':
          // Handle postback actions
          const data = new URLSearchParams(event.postback.data);
          switch (data.get('action')) {
            case 'confirm_pickup':
              await this.webhookService.replyMessage(event.replyToken, [{
                type: 'text',
                text: 'Thank you for confirming pickup! 👍',
              }]);
              break;
            // Add more postback handlers
          }
          break;
      }
    }

    return { success: true };
  }
}
