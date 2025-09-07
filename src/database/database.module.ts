import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.constants';

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE_CLIENT,
      useFactory: (configService: ConfigService) => {
        return createClient(
          configService.getOrThrow('SUPABASE_URL'),
          configService.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class DatabaseModule {}
