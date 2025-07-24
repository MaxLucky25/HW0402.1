import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { UsersService } from '../application/user.service';
import { UserViewDto } from './view-dto/users.view-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { UpdateUserInputDto } from './input-dto/update-user.input.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { BasicAuthGuard } from '../../guards/basic/basic-auth.guard';

@ApiTags('users')
@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  async getById(@Param('id') id: string): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail({ id });
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'pageNumber', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserInputDto })
  @ApiResponse({ status: 201, description: 'User created' })
  async create(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserInputDto })
  @ApiResponse({ status: 204, description: 'User updated' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserInputDto,
  ): Promise<void> {
    return this.usersService.updateUser({ id }, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser({ id });
  }
}
