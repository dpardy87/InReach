import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckIn } from './checkin.entity';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn) private checkInRepository: Repository<CheckIn>,
  ) {}

  // create a new check-in entry
  async createCheckIn(
    userId: string,
    latitude: number,
    longitude: number,
  ): Promise<CheckIn> {
    const newCheckIn = this.checkInRepository.create({
      userId,
      latitude,
      longitude,
    });
    return this.checkInRepository.save(newCheckIn);
  }

  // get all check-ins for user
  async getUserCheckIns(userId: string): Promise<CheckIn[]> {
    return this.checkInRepository.find({
      where: { userId },
      order: { checkInTime: 'DESC' },
    });
  }
}
