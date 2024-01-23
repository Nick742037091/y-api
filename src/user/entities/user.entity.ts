import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hashSync } from 'bcrypt';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column({ default: 0 })
  followingNum: number;

  @Column({ default: 0 })
  followerNum: number;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await hashSync(this.password, 10);
  }
}
