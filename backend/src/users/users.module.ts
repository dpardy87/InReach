import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { MySQLService } from '../mysql/mysql.service';

@Module({
  providers: [UserService, MySQLService],
  exports: [UserService], // Allow other modules to use UsersService
})
export class UsersModule {}
