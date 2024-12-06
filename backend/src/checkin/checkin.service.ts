import { Injectable } from '@nestjs/common';
import { MySQLService } from '../mysql/mysql.service';

@Injectable()
export class CheckInService {
  constructor(private readonly mysqlService: MySQLService) {}

  /**
   * Create a new check-in
   */
  async createCheckIn(
    userId: string,
    locationName: string,
    address: string,
    latitude: number,
    longitude: number,
    notes: string,
    distance: number,
  ): Promise<any> {
    try {
      const checkInTime = new Date();

      // Check if the location already exists
      const locationSql = `
        SELECT id FROM locations
        WHERE latitude = ? AND longitude = ? LIMIT 1
      `;
      const [locationRows] = await this.mysqlService.query(locationSql, [
        latitude,
        longitude,
      ]);

      let locationId: number;

      if (locationRows.length > 0) {
        // Use existing location ID
        locationId = locationRows[0].id;
      } else {
        // Insert new location
        const insertLocationSql = `
          INSERT INTO locations (locationName, address, latitude, longitude)
          VALUES (?, ?, ?, ?)
        `;
        const locationResult = await this.mysqlService.query(
          insertLocationSql,
          [locationName, address, latitude, longitude],
        );
        locationId = locationResult[0].insertId;
      }

      // Insert check-in
      const checkInSql = `
        INSERT INTO checkins (userId, locationId, notes, checkInTime, distance)
        VALUES (?, ?, ?, ?, ?)
      `;
      const checkInResult = await this.mysqlService.query(checkInSql, [
        userId,
        locationId,
        notes,
        checkInTime,
        distance,
      ]);

      return {
        message: 'Check-in added successfully',
        checkInId: checkInResult[0].insertId,
        userId,
        locationId,
        locationName,
        address,
        notes,
        checkInTime,
        distance,
      };
    } catch (error) {
      throw new Error(`Error creating new check-in: ${error.message}`);
    }
  }

  /**
   * Get all check-ins for a user
   */
  async getUserCheckIns(userId: number): Promise<any[]> {
    const sql = `
    SELECT
      c.id AS checkInId,
      c.notes,
      c.checkInTime,
      c.distance,
      l.locationName,
      l.address,
      l.latitude,
      l.longitude,
      l.createdAt AS locationCreatedAt,
      u.email AS userEmail,
      u.firstName AS userFirstName
    FROM checkins c
    LEFT JOIN locations l ON c.locationId = l.id
    LEFT JOIN users u ON c.userId = u.id
    WHERE c.userId = ?
    ORDER BY c.checkInTime DESC;
  `;
    const [rows] = await this.mysqlService.query(sql, [userId]);
    return rows;
  }
}
