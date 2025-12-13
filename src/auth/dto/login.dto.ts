import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名格式出错' })
  userName: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码格式出错' })
  password: string;
}
