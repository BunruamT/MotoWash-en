import { SupabaseClient } from '@supabase/supabase-js';
export declare class UsersRepository {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    findOrCreateByLineId(lineUserId: string): Promise<any>;
    findAdminByEmail(email: string): Promise<any>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
}
