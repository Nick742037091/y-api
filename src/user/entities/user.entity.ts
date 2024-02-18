import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hashSync } from 'bcrypt';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name' })
  userName: string;

  // 查表时不读取password字段，若需要查询，可通过select属性显性设置
  @Column({ select: false })
  password: string;

  // 请求传参为驼峰命名，数据库字段为短横杆命名
  @Column({ default: '', name: 'full_name' })
  fullName: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: 0, name: 'following_num' })
  followingNum: number;

  @Column({ default: 0, name: 'follower_num' })
  followerNum: number;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await hashSync(this.password, 10);
  }
}
