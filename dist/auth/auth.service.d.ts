import { SupabaseClient } from '@supabase/supabase-js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';
export declare class AuthService {
    private readonly supabase;
    private readonly jwtService;
    private readonly configService;
    private readonly usersRepository;
    constructor(supabase: SupabaseClient, jwtService: JwtService, configService: ConfigService, usersRepository: UsersRepository);
    verifyLiffToken(idToken: string): Promise<string>;
    adminLogin(email: string, password: string): Promise<string>;
}
