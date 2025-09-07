import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { createBookingSchema, CreateBookingDto } from './dto/create-booking.dto';
import { updateBookingSchema, UpdateBookingDto } from './dto/update-booking.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: string;
    lineUserId?: string;
  }
}

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() dto: CreateBookingDto, @Req() req: AuthenticatedRequest) {
    const validated = createBookingSchema.parse(dto);
    return this.bookingsService.create(req.user.userId, validated);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.bookingsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Req() req: AuthenticatedRequest) {
    const validated = updateBookingSchema.parse(dto);
    return this.bookingsService.update(id, req.user.userId, validated);
  }
}
