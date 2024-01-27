import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashSync } from 'bcrypt';
import { fail } from 'src/utils';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    // 解决与AuthService的循环依赖问题
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userName = createUserDto.userName;
    const isExist = await this.userRepository.findOneBy({
      userName: userName,
    });
    if (isExist) {
      return {
        code: 1,
        msg: '用户已存在',
      };
    }
    createUserDto.password = await hashSync(createUserDto.password, 10);
    const result = await this.userRepository.insert(createUserDto);
    const createInfo = result.generatedMaps[0];
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
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByName(name: string) {
    return this.userRepository.findOne({
      select: [
        'id',
        'userName',
        'fullName',
        'password',
        'avatar',
        'followingNum',
        'followerNum',
      ],
      where: {
        userName: name,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isExist = await this.userRepository.findOneBy({ id });
    if (!isExist) return fail({ msg: '用户不存在' });
    await this.userRepository.update(id, updateUserDto);
    return null;
  }

  async remove(id: number) {
    const isExist = await this.userRepository.findOneBy({ id });
    if (!isExist) return fail({ msg: '用户不存在' });
    return this.userRepository.delete(id);
  }
}
