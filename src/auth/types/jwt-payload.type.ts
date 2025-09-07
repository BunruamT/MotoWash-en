export type UserRole = 'customer' | 'admin';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  lineUserId?: string;
  iat?: number;
  exp?: number;
}
