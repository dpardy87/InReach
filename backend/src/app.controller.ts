import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('google-maps-api-key')
  getGoogleMapsApiKey() {
    return { apiKey: process.env.GOOGLE_MAPS_API_KEY };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
