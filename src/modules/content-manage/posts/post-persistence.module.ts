import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/post.entity';
import { PostRepository } from './infrastructure/postRepository';
import { PostQueryRepository } from './infrastructure/query/post.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostRepository, PostQueryRepository],
  exports: [PostRepository, PostQueryRepository],
})
export class PostPersistenceModule {}
