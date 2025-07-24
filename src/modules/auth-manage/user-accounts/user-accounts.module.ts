import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/user.controller';
import { UsersService } from './application/user.service';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { UsersRepository } from './infrastructure/user.repository';
import { HelpingApplicationModule } from '../access-control/application/helping-application/helping-application.module';
import { UserFactory } from './application/user.factory';
// import { HelpingApplicationModule } from 'src/modules/auth-manage/access-control/application/helping-application/helping-application.module';
// import { UserFactory } from 'src/modules/auth-manage/user-accounts/application/user.factory';

@Module({
  imports: [
    HelpingApplicationModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersQueryRepository, UsersRepository, UserFactory],
  exports: [UsersService, UsersRepository, UserFactory],
})
export class UsersAccountModule {}
