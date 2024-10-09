import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { CheckInService } from './checkin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('checkin')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  // Endpoint for users to check in
  @Post()
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  async createCheckIn(@Req() req, @Body() checkInDto: { latitude: number; longitude: number }) {

    const userId = req.user.userId; // Get user ID from JWT
    console.log("createCheckIn, userId: ", userId);
    const { latitude, longitude } = checkInDto;
    return this.checkInService.createCheckIn(userId, latitude, longitude);
  }

  // Endpoint to get the user's check-in history
  @Get('history')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT authentication
  async getCheckIns(@Req() req) {
    const userId = req.user.userId;
    return this.checkInService.getUserCheckIns(userId);
  }
}
