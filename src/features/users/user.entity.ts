import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: string;

  @Column({ default: false })
  isConfirmed: boolean;
}
