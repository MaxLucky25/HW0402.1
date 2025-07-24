import { Module } from '@nestjs/common';
import { BlogsModule } from './blogs/blogs.module';
import { BlogPersistenceModule } from './blogs/blog-persistence.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [BlogsModule, BlogPersistenceModule, PostsModule],
})
export class ContentModule {}
