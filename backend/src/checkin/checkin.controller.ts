import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { CheckInService } from './checkin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('checkin')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  // allows user to check in
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createCheckIn(@Req() req, @Body() checkInDto: { latitude: number; longitude: number }) {
    const userId = req.user.userId; // Get user ID from JWT
    const { latitude, longitude } = checkInDto;
    return this.checkInService.createCheckIn(userId, latitude, longitude);
  }

  // get the user's check-in history
  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getCheckIns(@Req() req) {
    const userId = req.user.userId;
    return this.checkInService.getUserCheckIns(userId);
  }
}
