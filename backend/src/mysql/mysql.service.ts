import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MySQLService implements OnModuleInit, OnModuleDestroy {
	private connection: mysql.Connection;

	async onModuleInit() {
	    this.connection = await mysql.createConnection({
	    	host: 'mysql', // based on docker-compose.yml
      		user: 'user',
      		password: 'password',
      		database: 'InReach',
	    });
	    console.log("MySQL connection established.");
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