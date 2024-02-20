import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/postLike.entity';
import { PostView } from './entities/postView.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike, PostView])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
