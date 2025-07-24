import { configModule } from './configs/dynamic-config-module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from './modules/testing/testing.module';
import { ContentModule } from './modules/content-manage/content.module';
import { AuthManageModule } from './modules/auth-manage/auth-manage.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exception.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerConfigModule } from './configs/throttle-config.module';

@Module({
  imports: [
    configModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/${Cluster0103}',
    ),
    ThrottlerConfigModule,
    AuthManageModule,
    ContentModule,
    TestingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
