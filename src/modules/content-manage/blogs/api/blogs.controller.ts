import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogQueryRepository } from '../infrastructure/query/blog.query-repository';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog.input.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostViewDto } from '../../posts/api/view-dto/post.view-dto';
import { PostQueryRepository } from '../../posts/infrastructure/query/post.query-repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { CreateBlogInputDto } from './input-dto/create-blog.input.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePostForBlogInputDto } from '../../posts/api/input-dto/create-post-for-blog.input.dto';
// import { CreatePostForBlogInputDto } from 'src/modules/content-manage/posts/api/input-dto/create-post-for-blog.input.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private blogQueryRepository: BlogQueryRepository,
    private postQueryRepository: PostQueryRepository,
    private blogsService: BlogsService,
    private postsService: PostsService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get blog by id' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'Blog found' })
  async getById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({ status: 200, description: 'List of blogs' })
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogQueryRepository.getAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a blog' })
  @ApiBody({ type: CreateBlogInputDto })
  @ApiResponse({ status: 201, description: 'Blog created' })
  async create(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    return this.blogsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a blog' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiBody({ type: UpdateBlogInputDto })
  @ApiResponse({ status: 204, description: 'Blog updated' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    return this.blogsService.updateBlog({ id }, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiResponse({ status: 204, description: 'Blog deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog({ id });
  }

  @Get(':id/posts')
  @ApiOperation({ summary: 'Get posts for a blog' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'List of blog posts' })
  async getPostsForBlog(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.getById(id);
    return this.postQueryRepository.getAllPostForBlog(id, query);
  }

  @Post(':id/posts')
  @ApiOperation({ summary: 'Create post for a blog' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiBody({ type: CreatePostForBlogInputDto })
  @ApiResponse({ status: 201, description: 'Post created' })
  async createPostForBlog(
    @Param('id') blogId: string,
    @Body() body: CreatePostForBlogInputDto,
  ): Promise<PostViewDto | null> {
    return this.postsService.createPostForBlog({ blogId }, body);
  }
}
