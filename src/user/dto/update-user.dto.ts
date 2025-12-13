import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: '姓名必须为字符串' })
  @IsNotEmpty({ message: '姓名不能为空' })
  fullName?: string;

  @IsOptional()
  @IsString({ message: '描述必须为字符串' })
  @IsNotEmpty({ message: '描述不能为空' })
  description?: string;

  @IsOptional()
  @IsString({ message: '头像必须为字符串' })
  @IsNotEmpty({ message: '头像不能为空' })
  profileBanner?: string;
}
