import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './utils/interceptors/transform.interceptor';
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';
import { HttpExecptionFilter } from './utils/execption/httpExecption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 引入自带的ValidationPipe，能使用class-validator的装饰器，实现数据校验和自动转换
  app.useGlobalPipes(new ValidationPipe());
  // 引入自定义的LoggingInterceptor，记录请求和响应日志
  app.useGlobalInterceptors(new LoggingInterceptor());
  // 引入自定义的TransformInterceptor，能将返回结果统一格式化为{code, data, msg}
  app.useGlobalInterceptors(new TransformInterceptor());
  // 引入自定义的HttpExecptionFilter，将校验异常信息数组转化为字符串
  app.useGlobalFilters(new HttpExecptionFilter());
  await app.listen(4001);
}
bootstrap();
