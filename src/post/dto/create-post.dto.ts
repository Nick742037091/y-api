import { IsNotEmpty } from 'class-validator';

// 需要校验非空值
export class CreatePostDto {
  @IsNotEmpty({ message: '帖子内容不能为空' })
  content: string;

  imgList: string[];

  video: string;

  videoPoster: string;

  gifVideo: string;

  gifPoster: string;

  gifWidth: number;

  gifHeight: number;
}
