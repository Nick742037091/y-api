import { IsNotEmpty } from 'class-validator';

// 需要校验非空值
export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  imgList: string[];

  video: string;

  videoPoster: string;

  gifVideo: string;

  gifPoster: string;

  gifWidth: number;

  gifHeight: number;
}
