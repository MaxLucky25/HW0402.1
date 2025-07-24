import { Injectable } from '@nestjs/common';
import { PostViewDto } from '../api/view-dto/post.view-dto';
import { PostRepository } from '../infrastructure/postRepository';
import { UpdatePostInputDto } from '../api/input-dto/update-post.input.dto';
import { BlogRepository } from '../../blogs/infrastructure/blog.repository';
import { CreatePostInputDto } from '../api/input-dto/create-post.input.dto';
// import { CreatePostForBlogInputDto } from 'src/modules/content-manage/posts/api/input-dto/create-post-for-blog.input.dto';
import { BlogIdDto, FindPostByIdDto } from '../domain/dto/post.domain.dto';
import { CreatePostForBlogInputDto } from '../api/input-dto/create-post-for-blog.input.dto';

@Injectable()
export class PostsService {
  constructor(
    private postRepository: PostRepository,
    private blogRepository: BlogRepository,
  ) {}

  async create(dto: CreatePostInputDto): Promise<PostViewDto> {
    const blog = await this.blogRepository.findOrNotFoundFail({
      id: dto.blogId,
    });
    const post = await this.postRepository.createPost({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    });
    return PostViewDto.mapToView(post);
  }

  async updatePost(
    id: FindPostByIdDto,
    dto: UpdatePostInputDto,
  ): Promise<void> {
    const post = await this.postRepository.findOrNotFoundFail(id);

    post.updatePost(dto);

    await this.postRepository.save(post);
  }

  async deletePost(id: FindPostByIdDto): Promise<void> {
    const post = await this.postRepository.findOrNotFoundFail(id);
    post.makeDelete();

    await this.postRepository.save(post);
  }

  async createPostForBlog(
    dto: BlogIdDto,
    input: CreatePostForBlogInputDto,
  ): Promise<PostViewDto> {
    return await this.create({ ...input, blogId: dto.blogId });
  }
}
