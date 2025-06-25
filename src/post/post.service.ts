import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { fail, success } from 'src/utils';
import { PrismaService } from 'src/utils/db/prisma/prisma.service';

@Injectable()
export class PostService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  constructor() {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const result = await this.prisma.post.create({
      data: {
        createUserId: userId,
        ...createPostDto,
        imgList: createPostDto.imgList ? createPostDto.imgList.join(',') : '',
      },
    });
    return result;
  }

  async findAll(pageSize: number, pageNum: number, userId: number) {
    const total = await this.prisma.post.count();
    const posts = await this.prisma.post.findMany({
      take: pageSize,
      skip: pageSize * (pageNum - 1),
      include: {
        user: true,
        postLikes: true,
        postViews: true,
      },
      orderBy: {
        createTime: 'desc',
      },
    });
    const list = posts.map((item) => {
      const { user, postLikes, postViews, ...rest } = item;
      const likedList = postLikes.filter((item) => item.liked);
      const isLiked = !!likedList.find((item) => item.user_id === userId);
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
        viewNum: postViews.length,
      };
    });
    return {
      total,
      list,
    };
  }

  async findOne(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { user: true, postLikes: true, postViews: true },
    });
    const { user, postLikes, postViews, imgList, ...rest } = post;
    const likedList = postLikes.filter((item) => item.liked);
    const isLiked = !!likedList.find((item) => item.user_id === userId);
    return {
      ...rest,
      imgList: imgList ? imgList.split(',') : [],
      userName: user.userName,
      fullName: user.fullName,
      avatar: user.avatar,
      isLiked,
      commentNum: 0,
      shareNum: 0,
      likeNum: likedList.length,
      viewNum: postViews.length,
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const findItem = await this.prisma.post.findUnique({ where: { id } });
    if (!findItem) {
      return fail({ msg: '帖子不存在' });
    }
    await this.prisma.post.update({
      where: { id },
      data: {
        ...updatePostDto,
        imgList: (updatePostDto.imgList || []).join(','),
      },
    });
    return success();
  }

  async remove(id: number) {
    const findItem = await this.prisma.post.findUnique({ where: { id } });
    if (!findItem) {
      return fail({ msg: '帖子不存在' });
    }
    await this.prisma.post.delete({ where: { id } });
  }

  async like(postId: number, userId: number, status: boolean = true) {
    const findPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!findPost) {
      return fail({ msg: '帖子不存在' });
    }
    const record = await this.prisma.postLike.findFirst({
      where: {
        post_id: postId,
        user_id: userId,
      },
    });
    if (record) {
      await this.prisma.postLike.update({
        where: { id: record.id },
        data: { liked: status },
      });
    } else {
      await this.prisma.postLike.create({
        data: {
          post_id: postId,
          user_id: userId,
          liked: status,
        },
      });
    }
    return success();
  }

  async view(postId: number, userId: number) {
    const findPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!findPost) {
      return fail({ msg: '帖子不存在' });
    }
    await this.prisma.postView.create({
      data: {
        post_id: postId,
        user_id: userId,
      },
    });
    return success();
  }
}
