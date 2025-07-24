import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostQueryRepository } from '../infrastructure/query/post.query-repository';
import { PostViewDto } from './view-dto/post.view-dto';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UpdatePostInputDto } from './input-dto/update-post.input.dto';
import { CreatePostInputDto } from './input-dto/create-post.input.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postQueryRepository: PostQueryRepository,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post found' })
  async getById(@Param('id') id: string): Promise<PostViewDto> {
    return this.postQueryRepository.getByIdNotFoundFail(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({ status: 200, description: 'List of posts' })
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postQueryRepository.getAllPost(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a post' })
  @ApiBody({ type: CreatePostInputDto })
  @ApiResponse({ status: 201, description: 'Post created' })
  async create(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    return this.postsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiBody({ type: UpdatePostInputDto })
  @ApiResponse({ status: 204, description: 'Post updated' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.postsService.updatePost({ id }, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 204, description: 'Post deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost({ id });
  }
}
