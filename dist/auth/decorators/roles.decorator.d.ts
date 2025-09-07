import { UserRole } from '../types/jwt-payload.type';
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
