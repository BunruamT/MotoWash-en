import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { CapacityModule } from './capacity/capacity.module';
import { AdminModule } from './admin/admin.module';
import { WebhookModule } from './webhook/webhook.module';
import { DatabaseModule } from './database/database.module';
import { validate } from './config/env.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    DatabaseModule,
    AuthModule,
    BookingsModule,
    CapacityModule,
    AdminModule,
    WebhookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
