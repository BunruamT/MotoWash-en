import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { SUPABASE_CLIENT } from '../database/supabase.constants';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async findOrCreateByLineId(lineUserId: string) {
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('*')
      .eq('line_user_id', lineUserId)
      .single();

    if (existingUser) {
      return existingUser;
    }

    const { data: newUser, error } = await this.supabase
      .from('users')
      .insert([{ line_user_id: lineUserId, role: 'customer' }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return newUser;
  }

  async findAdminByEmail(email: string) {
    const { data: admin } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    return admin;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
