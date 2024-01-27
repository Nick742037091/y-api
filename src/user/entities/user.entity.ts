import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hashSync } from 'bcrypt';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  // 查表时不读取password字段，若需要查询，可通过select属性显性设置
  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  fullName: string;

  @Column({ default: '' })
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
