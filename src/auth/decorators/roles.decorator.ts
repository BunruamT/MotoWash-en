import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../types/jwt-payload.type';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
