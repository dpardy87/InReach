import { IsString, Matches } from 'class-validator';

export class DistanceQueryDto {
  @IsString()
  @Matches(
    /^(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)(,(-?\d+(\.\d+)?),(-?\d+(\.\d+)?))*$/,
    {
      message:
        'Origins must be a valid latitude-longitude pair, e.g., "40.7128,-74.0060" or multiple pairs separated by commas.',
    },
  )
  origins: string;

  @IsString()
  @Matches(
    /^(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)(,(-?\d+(\.\d+)?),(-?\d+(\.\d+)?))*$/,
    {
      message:
        'Destinations must be a valid latitude-longitude pair, e.g., "34.0522,-118.2437" or multiple pairs separated by commas.',
    },
  )
  destinations: string;
}
