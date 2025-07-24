import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { Post, PostModelType } from '../../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';
import { sortDirectionToNumber } from '../../../../../core/dto/base.query-params.input-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getByIdNotFoundFail(id: string): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Post not found',
      });
    }
    return PostViewDto.mapToView(post);
  }

  async getAllPost(
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletedAt: null,
    };
    if (query.searchTitleTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        title: { $regex: query.searchTitleTerm, $options: 'i' },
      });
    }

    const post = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: sortDirectionToNumber(query.sortDirection) })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = post.map((post) => PostViewDto.mapToView(post));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
  async getAllPostForBlog(
    blogId: string,
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletedAt: null,
      blogId,
    };
    if (query.searchTitleTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        title: { $regex: query.searchTitleTerm, $options: 'i' },
      });
    }

    const post = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: sortDirectionToNumber(query.sortDirection) })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = post.map((post) => PostViewDto.mapToView(post));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
