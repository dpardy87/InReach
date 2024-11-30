import { Module } from '@nestjs/common';
import { MySQLService } from '../mysql/mysql.service';
import { CheckInService } from './checkin.service';
import { CheckInController } from './checkin.controller';

@Module({
  controllers: [CheckInController],
  providers: [CheckInService, MySQLService],
})
export class CheckInModule {}
