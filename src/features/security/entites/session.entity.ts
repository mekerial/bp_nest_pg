import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  issuedAt: Date;

  @Column()
  lastActiveDate: string;

  @Column()
  ip: string;

  @Column()
  deviceId: string;

  @Column()
  deviceName: string;

  @Column()
  userId: number;

  @Column()
  refreshToken: string;
}
