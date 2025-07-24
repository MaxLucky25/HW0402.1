import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogRepository } from './infrastructure/blog.repository';
import { BlogQueryRepository } from './infrastructure/query/blog.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [BlogRepository, BlogQueryRepository],
  exports: [BlogRepository, BlogQueryRepository],
})
export class BlogPersistenceModule {}
