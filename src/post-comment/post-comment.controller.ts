import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('postComment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPostCommentDto: CreatePostCommentDto, @Request() req) {
    return this.postCommentService.create(createPostCommentDto, req.userId);
  }

  @UseGuards(AuthGuard)
  @Get('list')
  findAll(
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('pageNum', ParseIntPipe) pageNum: number,
    @Query('postId', ParseIntPipe) postId: number,
  ) {
    return this.postCommentService.findAll(
      pageSize || 10,
      pageNum || 1,
      postId,
    );
  }

  // 接口从上到下进行匹配，因此要放在list接口下面，否则会覆盖list接口
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postCommentService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postCommentService.remove(id);
  }
}
