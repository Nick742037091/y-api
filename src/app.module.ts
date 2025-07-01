import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './utils/db/redis/redis.module';
import { PrismaModule } from './utils/db/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';
import { TrendingModule } from './tending/trending.module';
import { GroupModule } from './group/group.module';
import { NotificationModule } from './notification/notification.module';
import envConfig from './utils/config/envConfig';
import { PostCommentModule } from './post-comment/post-comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    UserModule,
    AuthModule,
    RedisModule,
    PrismaModule,
    PostModule,
    UploadModule,
    TrendingModule,
    GroupModule,
    NotificationModule,
    PostCommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
