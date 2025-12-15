# Y-API 项目架构文档

## 项目概述

Y-API 是一个基于 NestJS 框架构建的社交媒体后端 API 服务，提供用户管理、帖子发布、评论互动、文件上传等功能。项目采用模块化架构设计，使用 Prisma 作为 ORM 工具，MySQL 作为数据库，Redis 作为缓存服务。

## 技术栈

- **框架**: NestJS (基于 Node.js)
- **语言**: TypeScript
- **数据库**: MySQL
- **ORM**: Prisma
- **缓存**: Redis
- **认证**: JWT
- **文件存储**: 腾讯云 COS
- **数据验证**: class-validator
- **其他依赖**:
  - bcrypt: 密码加密
  - class-transformer: 数据转换
  - nanoid: ID 生成
  - cache-manager: 缓存管理
  - qcloud-cos-sts: 腾讯云临时凭证

## 项目结构

```
y-api/
├── src/                    # 源代码目录
│   ├── app.module.ts       # 应用主模块
│   ├── main.ts             # 应用入口文件
│   ├── auth/               # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.guard.ts   # 认证守卫
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── constants.ts
│   │   └── dto/            # 数据传输对象
│   ├── group/              # 群组模块
│   │   ├── group.controller.ts
│   │   └── group.module.ts
│   ├── notification/       # 通知模块
│   │   ├── notification.controller.ts
│   │   └── notification.module.ts
│   ├── post/               # 帖子模块
│   │   ├── dto/
│   │   ├── post.controller.ts
│   │   ├── post.module.ts
│   │   └── post.service.ts
│   ├── post-comment/       # 帖子评论模块
│   │   ├── dto/
│   │   ├── post-comment.controller.ts
│   │   ├── post-comment.module.ts
│   │   └── post-comment.service.ts
│   ├── tending/            # 热门趋势模块
│   │   ├── trending.controller.ts
│   │   └── trending.module.ts
│   ├── upload/             # 文件上传模块
│   │   ├── upload.controller.ts
│   │   ├── upload.module.ts
│   │   └── upload.service.ts
│   ├── user/               # 用户模块
│   │   ├── dto/
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   └── utils/              # 工具类
│       ├── config/         # 配置相关
│       ├── db/             # 数据库相关
│       │   ├── prisma/     # Prisma ORM
│       │   └── redis/      # Redis 缓存
│       ├── execption/      # 异常处理
│       ├── interceptors/   # 拦截器
│       │   ├── logging.interceptor.ts
│       │   └── transform.interceptor.ts
│       └── index.ts
├── prisma/                 # Prisma 配置
│   ├── migrations/         # 数据库迁移文件
│   └── schema.prisma       # 数据库模型定义
├── test/                   # 测试文件
├── .eslintrc.js            # ESLint 配置
├── .gitignore              # Git 忽略文件
├── .prettierrc             # Prettier 配置
├── nest-cli.json           # Nest CLI 配置
├── package.json            # 项目依赖和脚本
├── pnpm-lock.yaml          # PNPM 锁定文件
├── pm2.config.js           # PM2 配置
├── tsconfig.build.json     # TypeScript 构建配置
└── tsconfig.json           # TypeScript 配置
```

## 核心模块说明

### 1. 认证模块 (Auth)

负责用户认证和授权功能，使用 JWT 进行身份验证。

- **控制器**: `AuthController`
- **守卫**: `AuthGuard`
- **服务**: `AuthService`
- **功能**: 用户登录、注册、令牌验证
- **依赖**: UserModule, JwtModule

### 2. 用户模块 (User)

管理用户信息、用户关系等功能。

- **控制器**: `UserController`
- **服务**: `UserService`
- **功能**: 用户信息管理、关注/取消关注、获取关注列表等
- **依赖**: AuthModule (循环依赖，使用 forwardRef 解决)

### 3. 帖子模块 (Post)

处理帖子发布、浏览、点赞等功能。

- **控制器**: `PostController`
- **服务**: `PostService`
- **功能**: 发布帖子、获取帖子列表、点赞/取消点赞、浏览记录

### 4. 帖子评论模块 (PostComment)

处理帖子评论功能，支持多级评论和回复。

- **控制器**: `PostCommentController`
- **服务**: `PostCommentService`
- **功能**: 发表评论、回复评论、获取评论列表

### 5. 文件上传模块 (Upload)

处理文件上传功能，支持图片、视频等文件类型。

- **控制器**: `UploadController`
- **服务**: `UploadService`
- **功能**: 文件上传、获取上传凭证
- **存储**: 腾讯云 COS

### 6. 热门趋势模块 (Trending)

处理热门内容和趋势分析。

- **控制器**: `TrendingController`
- **功能**: 获取热门帖子、趋势分析

### 7. 群组模块 (Group)

处理用户群组相关功能。

- **控制器**: `GroupController`
- **功能**: 群组管理、成员管理等

### 8. 通知模块 (Notification)

处理系统通知和用户消息。

- **控制器**: `NotificationController`
- **功能**: 发送通知、获取通知列表

## 数据库设计

### 主要数据模型

1. **用户表 (user)**

   - 存储用户基本信息
   - 包含用户名、密码、头像、个人简介等
   - 记录关注数和粉丝数

2. **帖子表 (post)**

   - 存储帖子内容
   - 支持文本、图片、视频、GIF 等多种媒体类型
   - 关联用户信息

3. **帖子点赞表 (postLike)**

   - 记录用户对帖子的点赞状态
   - 关联用户和帖子

4. **帖子浏览表 (postView)**

   - 记录用户浏览帖子的历史
   - 用于统计和分析

5. **帖子评论表 (postComment)**
   - 存储帖子评论
   - 支持多级评论和回复
   - 关联用户和帖子

### 数据库关系

- 用户与帖子：一对多关系
- 用户与评论：一对多关系
- 帖子与评论：一对多关系
- 用户与点赞：多对多关系
- 用户与浏览：多对多关系
- 评论的自关联：支持多级评论和回复

## 工具类与中间件

### 1. 数据库工具

- **PrismaModule**: 全局 Prisma 服务模块，提供数据库连接和操作
- **RedisModule**: 全局 Redis 服务模块，提供缓存功能

### 2. 拦截器

- **LoggingInterceptor**: 全局拦截器，记录请求和响应日志
- **TransformInterceptor**: 全局拦截器，统一处理 API 响应格式

### 3. 异常处理

- **HttpExecptionFilter**: 全局异常过滤器，统一处理 HTTP 异常

### 4. 配置管理

- **envConfig**: 环境变量配置管理
- **ConfigModule**: NestJS 配置模块，全局可用

### 5. 数据验证

- **ValidationPipe**: 全局管道，使用 class-validator 进行数据验证

## API 设计规范

### 1. 响应格式

所有 API 响应统一格式：

```json
{
  "code": 0,
  "data": {},
  "msg": "操作成功"
}
```

- `code`: 状态码，0 表示成功
- `data`: 返回数据
- `msg`: 操作消息

### 2. 数据验证

使用 `class-validator` 和 `class-transformer` 进行数据验证和转换。

### 3. 认证授权

使用 JWT 进行身份验证，通过 Redis 管理令牌状态和过期时间。

## 环境配置

项目使用 `.env` 文件管理环境变量，主要配置项包括：

- 数据库连接信息
- Redis 连接信息
- JWT 密钥
- 腾讯云 COS 配置

## 部署说明

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run start:dev
```

### 生产环境

```bash
# 构建项目
pnpm run build

# 启动生产服务器
pnpm run start:prod
```

### 数据库迁移

```bash
# 开发环境迁移
pnpm run prisma:dev

# 生产环境迁移
pnpm run prisma:prod

# 生成 Prisma 客户端
pnpm run prisma:generate
```

### 代码检查与格式化

```bash
# 运行 ESLint 检查并自动修复
pnpm run lint

# 格式化代码
pnpm run format
```

### 测试

```bash
# 运行单元测试
pnpm run test

# 运行测试并生成覆盖率报告
pnpm run test:cov

# 运行端到端测试
pnpm run test:e2e
```

## 项目特点

1. **模块化设计**: 采用 NestJS 的模块化架构，各功能模块独立，便于维护和扩展
2. **统一响应格式**: 使用拦截器统一处理 API 响应格式
3. **全局异常处理**: 使用过滤器统一处理异常
4. **数据验证**: 使用 DTO 进行数据验证和转换
5. **缓存策略**: 使用 Redis 缓存提高性能
6. **ORM 集成**: 使用 Prisma 简化数据库操作
7. **类型安全**: 全面使用 TypeScript 提供类型安全

## 扩展指南

1. **添加新模块**: 使用 Nest CLI 生成模块、控制器和服务
2. **添加新 API**: 在相应模块的控制器中添加新路由
3. **数据库变更**: 修改 Prisma schema 并生成迁移文件
4. **添加新依赖**: 使用 pnpm 安装并更新 package.json

## 注意事项

1. 确保环境变量配置正确
2. 数据库迁移前备份数据
3. 生产环境部署前进行充分测试
4. 定期更新依赖包以修复安全漏洞

## 授权验证流程

本系统使用 JWT (JSON Web Token) 进行用户身份验证，并结合 Redis 实现令牌管理和验证。以下是详细的授权验证流程：

### 1. 令牌获取与存储

- 用户登录成功后，系统生成 JWT 令牌并返回给客户端
- 同时，系统将令牌存储在 Redis 中，键格式为 `token_${userId}`
- 客户端需要在后续请求的 Header 中携带该令牌，格式为 `Authorization: Bearer <token>`

### 2. 请求拦截与验证

所有需要授权的接口都会通过 `AuthGuard` 进行验证：

1. **令牌提取**: 从请求头的 `Authorization` 字段中提取 Bearer 令牌
2. **令牌验证**: 使用 JWT 密钥验证令牌的有效性和签名
3. **缓存验证**: 从 Redis 中获取缓存的令牌，确保令牌未被撤销
4. **令牌比对**: 比对请求令牌与缓存令牌，确保一致性

### 3. 用户信息注入

验证通过后，系统会将用户信息注入到请求对象中：

```typescript
request.user = {
  userId: payload.sub,
  userName: payload.username,
};
request.userId = payload.sub;
request.userName = payload.username;
```

这样，在后续的业务逻辑中可以直接通过 `request.userId` 和 `request.userName` 获取当前用户信息。

### 4. 异常处理

在验证过程中的任何环节失败，都会抛出 `UnauthorizedException` 异常：

- 缺少令牌：返回 "缺少token"
- 令牌验证失败：返回 "token校验失败"
- 缓存中无令牌：返回 "token校验失败"
- 令牌不匹配：返回 "token校验失败"

### 5. 令牌撤销

系统可以通过删除 Redis 中的令牌来实现令牌撤销，例如：

- 用户主动退出登录
- 管理员强制用户下线
- 检测到异常活动时

这种设计提供了灵活的令牌管理机制，同时保证了系统的安全性。

### 项目特点

1. **模块化设计**: 采用 NestJS 的模块化架构，各功能模块独立，便于维护和扩展
2. **统一响应格式**: 使用拦截器统一处理 API 响应格式
3. **全局异常处理**: 使用过滤器统一处理异常
4. **数据验证**: 使用 DTO 和 class-validator 进行数据验证和转换
5. **缓存策略**: 使用 Redis 缓存提高性能
6. **ORM 集成**: 使用 Prisma 简化数据库操作
7. **类型安全**: 全面使用 TypeScript 提供类型安全
8. **日志记录**: 使用拦截器记录请求和响应日志
9. **数据验证**: 使用 class-validator 进行全面的数据验证

## 扩展指南

1. **添加新模块**: 使用 Nest CLI 生成模块、控制器和服务
2. **添加新 API**: 在相应模块的控制器中添加新路由
3. **数据库变更**: 修改 Prisma schema 并生成迁移文件
4. **添加新依赖**: 使用 pnpm 安装并更新 package.json

## 注意事项

1. 确保环境变量配置正确
2. 数据库迁移前备份数据
3. 生产环境部署前进行充分测试
4. 定期更新依赖包以修复安全漏洞
5. 使用 pnpm 作为包管理器，确保依赖一致性

## 授权验证流程

本系统使用 JWT (JSON Web Token) 进行用户身份验证，并结合 Redis 实现令牌管理和验证。以下是详细的授权验证流程：

### 1. 令牌获取与存储

- 用户登录成功后，系统生成 JWT 令牌并返回给客户端
- 同时，系统将令牌存储在 Redis 中，键格式为 `token_${userId}`
- 客户端需要在后续请求的 Header 中携带该令牌，格式为 `Authorization: Bearer <token>`

### 2. 请求拦截与验证

所有需要授权的接口都会通过 `AuthGuard` 进行验证：

1. **令牌提取**: 从请求头的 `Authorization` 字段中提取 Bearer 令牌
2. **令牌验证**: 使用 JWT 密钥验证令牌的有效性和签名
3. **缓存验证**: 从 Redis 中获取缓存的令牌，确保令牌未被撤销
4. **令牌比对**: 比对请求令牌与缓存令牌，确保一致性

### 3. 用户信息注入

验证通过后，系统会将用户信息注入到请求对象中：

```typescript
request.user = {
  userId: payload.sub,
  userName: payload.username,
};
request.userId = payload.sub;
request.userName = payload.username;
```

这样，在后续的业务逻辑中可以直接通过 `request.userId` 和 `request.userName` 获取当前用户信息。

### 4. 异常处理

在验证过程中的任何环节失败，都会抛出 `UnauthorizedException` 异常：

- 缺少令牌：返回 "缺少token"
- 令牌验证失败：返回 "token校验失败"
- 缓存中无令牌：返回 "token校验失败"
- 令牌不匹配：返回 "token校验失败"

### 5. 令牌撤销

系统可以通过删除 Redis 中的令牌来实现令牌撤销，例如：

- 用户主动退出登录
- 管理员强制用户下线
- 检测到异常活动时

这种设计提供了灵活的令牌管理机制，同时保证了系统的安全性。

## TODO

1. 优化数据验证，支持中文提示
