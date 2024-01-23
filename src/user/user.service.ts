import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashSync } from 'bcrypt';
import { fail } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userRepository.findOneBy({
      userName: createUserDto.userName,
    });
    if (isExist) {
      return {
        code: 1,
        msg: '用户已存在',
      };
    }
    createUserDto.password = await hashSync(createUserDto.password, 10);
    const result = await this.userRepository.insert(createUserDto);
    return result.identifiers[0];
  }

  async findAll() {
    return await this.userRepository.find({
      select: [
        'id',
        'userName',
        'fullName',
        'avatar',
        'followingNum',
        'followerNum',
      ],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByName(name: string) {
    return this.userRepository.findOneBy({ userName: name });
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
