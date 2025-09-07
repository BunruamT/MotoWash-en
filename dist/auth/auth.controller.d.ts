import { z } from 'zod';
import { AuthService } from './auth.service';
declare const liffVerifySchema: z.ZodObject<{
    idToken: z.ZodString;
}, z.core.$strip>;
declare const adminLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    verifyLiffToken(body: z.infer<typeof liffVerifySchema>): Promise<{
        token: string;
    }>;
    adminLogin(body: z.infer<typeof adminLoginSchema>): Promise<{
        token: string;
    }>;
}
export {};
