import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { PrismaService } from 'src/utils/db/prisma/prisma.service';

@Injectable()
export class PostCommentService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  constructor() {}

  async create(createPostCommentDto: CreatePostCommentDto, userId: number) {
    const {
      postId,
      content,
      imgList,
      parentId = null,
      replyToId = null,
    } = createPostCommentDto;
    if (replyToId) {
      const replyTo = await this.prisma.postComment.findFirst({
        where: { id: replyToId },
      });
      if (!replyTo) {
        throw new BadRequestException('回复的评论不存在');
      }
    }
    const result = await this.prisma.postComment.create({
      data: {
        postId,
        userId,
        content,
        imgList: imgList ? imgList.join(',') : '',
        parentId,
        replyToId,
      },
    });
    console.log(result);
    return result;
  }

  async findAll(pageSize: number, pageNum: number, postId: number) {
    const skip = (pageNum - 1) * pageSize;
    const selectUser = {
      select: {
        id: true,
        userName: true,
        avatar: true,
      },
    };
    const postSelect = {
      id: true,
      content: true,
      imgList: true,
      createTime: true,
      user: selectUser,
    };
    const result = await this.prisma.postComment.findMany({
      where: {
        postId,
        parentId: null,
      },
      skip,
      take: pageSize,
      select: {
        ...postSelect,
        children: {
          select: {
            ...postSelect,
            // parentId 和 replyTo.id不一致时显示【回复】
            parentId: true,
            replyTo: {
              select: {
                id: true,
                user: selectUser,
              },
            },
          },
        },
      },
    });
    return result;
  }

  async findOne(id: number) {
    const selectUser = {
      select: {
        id: true,
        userName: true,
        avatar: true,
      },
    };
    const postSelect = {
      id: true,
      content: true,
      imgList: true,
      createTime: true,
      user: selectUser,
    };
    const result = await this.prisma.postComment.findFirst({
      where: { id },
      select: {
        ...postSelect,
        children: {
          select: {
            ...postSelect,
            // parentId 和 replyTo.id不一致时显示【回复】
            parentId: true,
            replyTo: {
              select: {
                id: true,
                user: selectUser,
              },
            },
          },
        },
      },
    });
    return result;
  }

  async remove(id: number) {
    const result = await this.prisma.postComment.delete({
      where: { id },
    });
    return result;
  }
}
