import { Injectable } from '@nestjs/common';
import { MySQLService } from '../mysql/mysql.service';

@Injectable()
export class UserService {
  constructor(private readonly mysqlService: MySQLService) {}

  /**
   * Find a user by Google ID
   * @param googleId - Unique identifier from Google OAuth
   */
  async findByGoogleId(googleId: string): Promise<any> {
    const sql = `SELECT * FROM users WHERE googleId = ? LIMIT 1`;
    const [rows] = await this.mysqlService.query(sql, [googleId]);
    return rows[0]; // Return the first result or undefined if not found
  }

  /**
   * Create a new user
   * @param userData - User details to insert
   */
  async createUser(userData: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }): Promise<any> {
    const {
      googleId,
      email,
      firstName = null,
      lastName = null,
      picture = null,
    } = userData;
    const sql = `
      INSERT INTO users (googleId, email, firstName, lastName, picture)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await this.mysqlService.query(sql, [
      googleId,
      email,
      firstName,
      lastName,
      picture,
    ]);

    return {
      id: result[0].insertId, // Inserted user's ID
      ...userData,
    };
  }

  /**
   * Update user information
   * @param userId - Internal user ID
   * @param updates - Fields to update
   */
  async updateUser(userId: number, updates: Partial<any>): Promise<any> {
    const fields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(', ');
    const values = Object.values(updates);

    const sql = `UPDATE users SET ${fields} WHERE id = ?`;
    await this.mysqlService.query(sql, [...values, userId]);

    return { id: userId, ...updates };
  }
}
