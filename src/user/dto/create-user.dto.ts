import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;

  // @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  avatar: string;
}
