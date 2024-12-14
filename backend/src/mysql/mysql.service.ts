import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MySQLService implements OnModuleInit, OnModuleDestroy {
  private connection: mysql.Connection;

  async onModuleInit() {
    this.connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'mysql',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log('MySQL connection established.');
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.end();
      console.log('MySQL connection closed');
    }
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    return this.connection.execute(sql, params);
  }
}
