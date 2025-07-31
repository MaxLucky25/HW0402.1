import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../infrastructure/blog.repository';
import { BlogViewDto } from '../api/view-dto/blog.view-dto';
import { UpdateBlogInputDto } from '../api/input-dto/update-blog.input.dto';
import { CreateBlogInputDto } from '../api/input-dto/create-blog.input.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { FindByIdDto } from '../domain/dto/blog.domain.dto';

@Injectable()
export class BlogsService {
  constructor(private blogRepository: BlogRepository) {}

  async create(dto: CreateBlogInputDto): Promise<BlogViewDto> {
    const existing = await this.blogRepository.findByName({ name: dto.name });
    if (existing) {
      throw new DomainException({
        code: DomainExceptionCode.AlreadyExists,
        message: 'Blog with this name already exists',
        field: 'Name',
      });
    }
    const blog = await this.blogRepository.createBlog(dto);
    return BlogViewDto.mapToView(blog);
  }

  async updateBlog(id: FindByIdDto, dto: UpdateBlogInputDto): Promise<void> {
    const blog = await this.blogRepository.findOrNotFoundFail(id);

    blog.update(dto);

    await this.blogRepository.save(blog);
  }

  async deleteBlog(id: FindByIdDto): Promise<void> {
    const blog = await this.blogRepository.findOrNotFoundFail(id);
    blog.makeDeleted();
    await this.blogRepository.save(blog);
  }
}
