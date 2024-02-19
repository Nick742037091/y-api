import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { fail, success } from 'src/utils';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const result = await this.postRepository.save({
      ...createPostDto,
      createUserId: userId,
      imgList: createPostDto.imgList ? createPostDto.imgList.join(',') : null,
    });
    return await this.postRepository.find({ where: { id: result.id } });
  }

  async findAll(pageSize: number, pageNum: number) {
    const dealList = (post: Post[]) => {
      return post.map((item) => {
        return {
          ...item,
          imgList: item.imgList ? item.imgList.split(',') : [],
        };
      });
    };
    if (!pageSize || !pageNum) {
      const list = await this.postRepository.find();
      return dealList(list);
    }
    const total = await this.postRepository.count();
    const list = await this.postRepository.find({
      take: pageSize,
      skip: pageSize * (pageNum - 1),
    });
    return {
      total,
      list: dealList(list),
    };
  }

  async findOne(id: number) {
    return await this.postRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, {
      ...updatePostDto,
      imgList: (updatePostDto.imgList || []).join(','),
    });
    return success();
  }

  async remove(id: number) {
    const findItem = await this.postRepository.findOne({ where: { id } });
    if (!findItem) {
      return fail({ msg: '帖子不存在' });
    }
    await this.postRepository.delete(id);
  }
}
