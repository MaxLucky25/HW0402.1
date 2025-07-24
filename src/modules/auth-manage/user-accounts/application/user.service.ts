import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/user.repository';
import { UpdateUserInputDto } from '../api/input-dto/update-user.input.dto';
import { UserViewDto } from '../api/view-dto/users.view-dto';
import { FindByIdDto } from '../infrastructure/dto/repoDto';
import { CreateUserInputDto } from '../api/input-dto/users.input-dto';
import { UserFactory } from './user.factory';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private userFactory: UserFactory,
  ) {}

  async createUser(dto: CreateUserInputDto): Promise<UserViewDto> {
    const user = await this.userFactory.create(dto);
    return UserViewDto.mapToView(user);
  }

  async updateUser(id: FindByIdDto, dto: UpdateUserInputDto): Promise<void> {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.update(dto);

    await this.usersRepository.save(user);
  }

  async deleteUser(id: FindByIdDto): Promise<void> {
    const user = await this.usersRepository.findOrNotFoundFail(id);
    user.makeDeleted();
    await this.usersRepository.save(user);
  }
}
