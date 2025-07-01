import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

// 需要校验非空值
export class CreatePostCommentDto {
  // 第一级评论id，用于批量展示
  @IsOptional()
  @IsInt()
  parentId?: number;

  // 回复的评论id
  @IsOptional()
  @IsInt()
  replyToId?: number;

  @IsNotEmpty()
  @IsInt()
  postId: number;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  imgList?: string[];
}
