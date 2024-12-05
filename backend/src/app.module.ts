import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MySQLService } from './mysql/mysql.service';
import { AuthModule } from './auth/auth.module';
import { CheckInModule } from './checkin/checkin.module';
import { ConfigModule } from '@nestjs/config';
import { MapsModule } from './maps/maps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CheckInModule,
    AuthModule,
    MapsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MySQLService],
})
export class AppModule {}
