import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSync } from 'bcrypt';
import { fail } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from 'src/utils/db/prisma/prisma.service';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;
  
  constructor(
    // 解决与AuthService的循环依赖问题
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userName = createUserDto.userName;
    const isExist = await this.prisma.user.findFirst({
      where: {
        userName,
      },
    });
    if (isExist) {
      return {
        code: 1,
        msg: '用户已存在',
      };
    }
    createUserDto.password = await hashSync(createUserDto.password, 10);
    const result = await this.prisma.user.create({
      data: createUserDto,
    });
    const createInfo = result;
    const token = await this.authService.createTokenAndPersist(
      createInfo.id,
      userName,
    );
    return {
      token,
      userInfo: {
        userName,
        ...createInfo,
      },
    };
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        fullName: true,
        password: true,
        avatar: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      }
    });
  }

  findOneByName(name: string) {
    return this.prisma.user.findFirst({
      where: {
        userName: name,
      },
      select: {
        id: true,
        userName: true,
        fullName: true,
        password: true,
        avatar: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isExist = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!isExist) return fail({ msg: '用户不存在' });
    await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    return null;
  }

  async remove(id: number) {
    const isExist = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!isExist) return fail({ msg: '用户不存在' });
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
