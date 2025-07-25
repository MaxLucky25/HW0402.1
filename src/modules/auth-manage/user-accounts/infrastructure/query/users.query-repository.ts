import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../domain/user.entity';
import { UserViewDto } from '../../api/view-dto/users.view-dto';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';
import { sortDirectionToNumber } from '../../../../../core/dto/base.query-params.input-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { FindByIdDto } from '../dto/repoDto';

export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(dto: FindByIdDto): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: dto.id,
      deletedAt: null,
    });

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found!',
      });
    }

    return UserViewDto.mapToView(user);
  }

  async getAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter: FilterQuery<User> = {
      deletedAt: null,
    };

    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }

    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }

    const users = await this.UserModel.find(filter)
      .sort({ [query.sortBy]: sortDirectionToNumber(query.sortDirection) })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.UserModel.countDocuments(filter);

    const items = users.map((user) => UserViewDto.mapToView(user));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
