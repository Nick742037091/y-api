import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { fail, success } from 'src/utils';
import { PostLike } from './entities/postLike.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const result = await this.postRepository.save({
      ...createPostDto,
      createUserId: userId,
      imgList: createPostDto.imgList ? createPostDto.imgList.join(',') : null,
    });
    return await this.postRepository.find({ where: { id: result.id } });
  }

  async findAll(pageSize: number, pageNum: number, userId: number) {
    const dealList = (post: Post[]) => {
      return post.map((item) => {
        const { user, postLikes, ...rest } = item;
        const likedList = postLikes.filter((item) => item.liked);
        const isLiked = !!likedList.find((item) => item.userId === userId);
        return {
          ...rest,
          imgList: item.imgList ? item.imgList.split(',') : [],
          userName: user.userName,
          fullName: user.fullName,
          avatar: user.avatar,
          isLiked,
          commentNum: 0,
          shareNum: 0,
          likeNum: likedList.length,
          viewNum: 0,
        };
      });
    };
    const total = await this.postRepository.count();
    const list = await this.postRepository.find({
      take: pageSize,
      skip: pageSize * (pageNum - 1),
      relations: {
        user: true,
        postLikes: true,
      },
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

  async like(postId: number, userId: number, status: boolean = true) {
    const record = await this.postLikeRepository.findOne({
      where: {
        postId,
        userId,
      },
    });
    if (record) {
      record.liked = status;
      await this.postLikeRepository.save(record);
    } else {
      await this.postLikeRepository.save({
        postId,
        userId,
        liked: status,
      });
    }
    return success();
  }
}
