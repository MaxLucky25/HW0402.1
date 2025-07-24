import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/user.repository';
import { UserDocument } from '../domain/user.entity';
import { CreateUserInputDto } from '../api/input-dto/users.input-dto';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';
import { BcryptService } from '../../access-control/application/helping-application/bcrypt.service';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class UserFactory {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: CreateUserInputDto): Promise<UserDocument> {
    const byLogin = await this.usersRepository.findByLoginOrEmail({
      loginOrEmail: dto.login,
    });

    const byEmail = await this.usersRepository.findByLoginOrEmail({
      loginOrEmail: dto.email,
    });
    if (byLogin || byEmail) {
      throw new DomainException({
        code: DomainExceptionCode.AlreadyExists,
        message: 'Login or Email already exists!',
      });
    }
    const passwordHash = await this.bcryptService.generateHash({
      password: dto.password,
    });

    const user: CreateUserDomainDto = {
      ...dto,
      passwordHash,
    };

    return this.usersRepository.createUser(user);
  }
}
