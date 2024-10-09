import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('check_ins') // This tells TypeORM to use the 'check_ins' table
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column('double')
  latitude: number;

  @Column('double')
  longitude: number;

  @CreateDateColumn()
  checkInTime: Date;
}
