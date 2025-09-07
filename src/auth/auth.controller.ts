import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';

const liffVerifySchema = z.object({
  idToken: z.string(),
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('liff/verify')
  @HttpCode(200)
  async verifyLiffToken(@Body() body: z.infer<typeof liffVerifySchema>) {
    const { idToken } = liffVerifySchema.parse(body);
    const token = await this.authService.verifyLiffToken(idToken);
    return { token };
  }

  @Post('admin/login')
  @HttpCode(200)
  async adminLogin(@Body() body: z.infer<typeof adminLoginSchema>) {
    const { email, password } = adminLoginSchema.parse(body);
    const token = await this.authService.adminLogin(email, password);
    return { token };
  }
}
