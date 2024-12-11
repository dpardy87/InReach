import { Controller, Get, Query, Res } from '@nestjs/common';
import { DistanceQueryDto } from '../common/dto/distance-query.dto';
import { Response } from 'express';
import axios from 'axios';

@Controller('maps')
export class MapsController {
  @Get('distance')
  async getDistance(@Query() query: DistanceQueryDto, @Res() res: Response) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const { origins, destinations } = query;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error fetching distance from Google Maps API:', error);

      const statusCode = error.response?.status || 500;

      // create sanitized error message
      const clientErrorMessage =
        statusCode === 500
          ? 'An internal server error occurred. Please try again later.'
          : 'Error fetching distance. Please check your inputs and try again.';

      // log full details
      console.error('Full Error Details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });

      // send to client
      res.status(statusCode).json({ message: clientErrorMessage });
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
      res.status(response.status).json(response.data); // Forward the API response to the client
    } catch (error) {
      console.error('Error fetching geocode data:', error);

      const statusCode = error.response?.status || 500;

      // create sanitized error message
      const clientErrorMessage =
        statusCode === 500
          ? 'An internal server error occurred while fetching geocode data. Please try again later.'
          : 'Error fetching geocode data. Please check your inputs and try again.';

      // log full details
      console.error('Full Error Details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });

      // send to client
      res.status(statusCode).json({ message: clientErrorMessage });
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
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error fetching autocomplete data:', error);

      const statusCode = error.response?.status || 500;

      // create sanitized error message
      const clientErrorMessage =
        statusCode === 500
          ? 'An internal server error occurred while fetching autocomplete data. Please try again later.'
          : 'Error fetching autocomplete data. Please check your inputs and try again.';

      // log full details
      console.error('Full Error Details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });

      // send to client
      res.status(statusCode).json({ message: clientErrorMessage });
    }
  }
}
