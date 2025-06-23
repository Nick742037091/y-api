import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.create(createPostDto, req.userId);
  }

  @UseGuards(AuthGuard)
  @Get('list')
  findAll(
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('pageNum', ParseIntPipe) pageNum: number,
    @Request() req,
  ) {
    return this.postService.findAll(+pageSize || 10, +pageNum || 1, req.userId);
  }

  @UseGuards(AuthGuard)
  @Get('getNewPosterList')
  getNewPosterList() {
    return [];
  }

  // 接口从上到下进行匹配，因此要放在list接口下面，否则会覆盖list接口
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.postService.findOne(id, req.userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('like')
  like(
    @Body('postId', ParseIntPipe) postId: number,
    @Body('status', ParseBoolPipe) status: boolean,
    @Request() req,
  ) {
    return this.postService.like(postId, req.userId, status);
  }

  @UseGuards(AuthGuard)
  @Post('view')
  view(@Body('postId', ParseIntPipe) postId: number, @Request() req) {
    return this.postService.view(postId, req.userId);
  }
}
