import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { CheckInService } from './checkin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('checkin')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  /**
   * Allows a user to check in
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createCheckIn(
    @Req() req,
    @Body()
    checkInDto: {
      locationName: string;
      address: string;
      latitude: number;
      longitude: number;
      notes: string;
      distance: number;
    },
  ) {
    const userId = req.user.userId; // Extract user ID from JWT
    const { locationName, address, latitude, longitude, notes, distance } =
      checkInDto;

    return this.checkInService.createCheckIn(
      userId,
      locationName,
      address,
      latitude,
      longitude,
      notes,
      distance,
    );
  }

  /**
   * Get the user's check-in history
   */
  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getCheckIns(@Req() req) {
    const userId = req.user.userId;
    return this.checkInService.getUserCheckIns(userId);
  }
}
