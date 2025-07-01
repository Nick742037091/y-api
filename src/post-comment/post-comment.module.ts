import { Module } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { PostCommentController } from './post-comment.controller';

@Module({
  imports: [],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
