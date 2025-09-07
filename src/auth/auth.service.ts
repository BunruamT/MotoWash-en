import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';
import { SUPABASE_CLIENT } from '../database/supabase.constants';
import { JwtPayload, UserRole } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async verifyLiffToken(idToken: string): Promise<string> {
    // Verify LIFF idToken with LINE Login platform
    const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        id_token: idToken,
        client_id: this.configService.getOrThrow('LINE_LOGIN_CHANNEL_ID'),
        nonce: '', // Optional: If you're using nonce verification
      }),
    });

    if (!response.ok) {
      throw new Error('Invalid LINE LIFF token');
    }

    const lineProfile = await response.json();
    
    // Map or create user in Supabase
    const user = await this.usersRepository.findOrCreateByLineId(lineProfile.sub);

    // Issue app JWT
    const payload: JwtPayload = {
      sub: user.id,
      role: 'customer' as UserRole,
      lineUserId: lineProfile.sub,
    };

    return this.jwtService.sign(payload);
  }

  async adminLogin(email: string, password: string): Promise<string> {
    const admin = await this.usersRepository.findAdminByEmail(email);
    
    if (!admin || !await this.usersRepository.verifyPassword(password, admin.password)) {
      throw new Error('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: admin.id,
      role: 'admin' as UserRole,
    };

    return this.jwtService.sign(payload);
  }
}
