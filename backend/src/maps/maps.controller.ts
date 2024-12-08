import { Controller, Get, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('maps')
export class MapsController {
  @Get('distance')
  async getDistance(
    @Query('origins') origins: string,
    @Query('destinations') destinations: string,
    @Res() res: Response,
  ) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error('Error fetching distance from Google Maps API:', error);
      res
        .status(error.response?.status || 500)
        .send(error.response?.data || 'Internal Server Error');
    }
  }

  @Get('geocode')
  async geocode(@Query('address') address: string, @Res() res: Response) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      res.status(response.status).send(response.data); // Forward the API response to the client
    } catch (error) {
      console.error('Error fetching geocode data:', error);
      res
        .status(error.response?.status || 500)
        .send(error.response?.data || 'Internal Server Error');
    }
  }

  @Get('autocomplete')
  async getAutocomplete(@Query('input') input: string, @Res() res: Response) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input,
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error('Error fetching autocomplete data:', error);
      res
        .status(error.response?.status || 500)
        .send(error.response?.data || 'Internal Server Error');
    }
  }
}
