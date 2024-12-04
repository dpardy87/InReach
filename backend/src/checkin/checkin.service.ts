import { Injectable } from '@nestjs/common';
import { MySQLService } from '../mysql/mysql.service';

@Injectable()
export class CheckInService {
  constructor(private readonly mysqlService: MySQLService) {}

  // create new check-in
  async createCheckIn(
    userId: string,
    latitude: number,
    longitude: number,
  ): Promise<any> {
    try {
      const checkInTime = new Date();
      const sql = `INSERT INTO checkins (user_id, latitude, longitude, check_in_time) VALUES (?, ?, ?, ?)`;
      console.log(userId, latitude, longitude, checkInTime);
      const result = await this.mysqlService.query(sql, [
        userId,
        latitude,
        longitude,
        checkInTime,
      ]);
      console.log('result: ', result);
      return {
        message: 'Check-in added successfully',
        id: result[0]?.insertId,
        userId,
        latitude,
        longitude,
        checkInTime,
      };
    } catch (error) {
      throw new Error(`Error creating new check-in: ${error.message}`);
    }
  }

  // get all check-ins for a user
  async getUserCheckIns(userId: string): Promise<any[]> {
    const sql = `
      SELECT id, user_id AS userId, latitude, longitude, check_in_time AS checkInTime
      FROM checkins
      WHERE user_id = ?
      ORDER BY check_in_time DESC
    `;

    const [rows] = await this.mysqlService.query(sql, [userId]);
    return rows;
  }
}
