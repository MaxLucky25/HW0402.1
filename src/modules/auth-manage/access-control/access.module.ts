import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { UsersAccountModule } from '../user-accounts/user-accounts.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from '../guards/local/local.strategy';
import { JwtStrategy } from '../guards/bearer/jwt.strategy';
import { HelpingApplicationModule } from './application/helping-application/helping-application.module';
// import { HelpingApplicationModule } from 'src/modules/auth-manage/access-control/application/helping-application/helping-application.module';

@Module({
  imports: [
    HelpingApplicationModule,
    UsersAccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthQueryRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService, AuthQueryRepository],
})
export class AccessModule {}
