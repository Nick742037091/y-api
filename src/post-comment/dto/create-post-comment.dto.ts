import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

// 需要校验非空值
export class CreatePostCommentDto {
  // 第一级评论id，用于批量展示
  @IsOptional()
  @IsInt({ message: '父级评论id必须为整数' })
  parentId?: number;

  // 回复的评论id
  @IsOptional()
  @IsInt({ message: '回复的评论id必须为整数' })
  replyToId?: number;

  @IsNotEmpty({ message: '帖子id不能为空' })
  @IsInt({ message: '帖子id必须为整数' })
  postId: number;

  @IsNotEmpty({ message: '评论内容不能为空' })
  content: string;

  @IsOptional()
  imgList?: string[];
}
