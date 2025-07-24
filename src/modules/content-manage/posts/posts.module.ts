import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/post.entity';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostRepository } from './infrastructure/postRepository';
import { PostQueryRepository } from './infrastructure/query/post.query-repository';
import { BlogPersistenceModule } from '../blogs/blog-persistence.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    BlogPersistenceModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, PostQueryRepository],
  exports: [PostsService],
})
export class PostsModule {}
