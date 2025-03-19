import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './utils/db/redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';
import { TrendingModule } from './tending/trending.module';
import { GroupModule } from './group/group.module';
import { NotificationModule } from './notification/notification.module';
import envConfig from './utils/config/envConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: 'y',
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    AuthModule,
    RedisModule,
    PostModule,
    UploadModule,
    TrendingModule,
    GroupModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
