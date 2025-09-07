import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';
import { CapacityService } from './capacity.service';

const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

@Controller('capacity')
@UseGuards(AuthGuard('jwt'))
export class CapacityController {
  constructor(private readonly capacityService: CapacityService) {}

  @Get('availability')
  async getAvailability(@Query() query: z.infer<typeof availabilityQuerySchema>) {
    const { date } = availabilityQuerySchema.parse(query);
    return this.capacityService.getAvailability(date);
  }
}
