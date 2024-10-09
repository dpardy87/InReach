import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInService } from './checkin.service';
import { CheckInController } from './checkin.controller';
import { CheckIn } from './checkin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn])],
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
