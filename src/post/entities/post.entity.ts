import { User } from 'src/user/entities/user.entity';
import { PostLike } from './postLike.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

// 主要定义类型，不需要非空，默认值信息
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'create_user_id' })
  createUserId: number;

  // 表字段需要设置默认值为CURRENT_TIMESTAMP
  // `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
  @CreateDateColumn({ name: 'create_time', type: 'datetime' })
  createTime: Date;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', name: 'img_list' })
  imgList: string;

  @Column()
  video: string;

  @Column({ name: 'video_poster' })
  videoPoster: string;

  @Column({ name: 'gif_video' })
  gifVideo: string;

  @Column({ name: 'gif_poster' })
  gifPoster: string;

  @Column({ name: 'gif_width' })
  gifWidth: number;

  @Column({ name: 'gif_height' })
  gifHeight: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_user_id' })
  user: User;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];
}
