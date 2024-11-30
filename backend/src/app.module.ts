import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CheckInModule } from './checkin/checkin.module';
import { MySQLService } from './mysql/mysql.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CheckInModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, MySQLService],
})
export class AppModule {}
