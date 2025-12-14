import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * 拦截请求并记录日志
   * @param context 执行上下文
   * @param next 下一个处理程序
   * @returns Observable<any>
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, ip } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          // 请求成功完成
          const responseTime = Date.now() - now;
          const { statusCode } = response;

          // 记录请求和响应信息
          this.logger.log(
            `${method} ${url} ${statusCode} ${responseTime}ms ` +
              JSON.stringify({
                request: {
                  ip,
                  method,
                  url,
                  headers: request.headers,
                },
                response: {
                  statusCode,
                  headers: response.getHeaders(),
                  body: data,
                },
              }),
          );
        },
        error: (error) => {
          // 请求处理出错
          const responseTime = Date.now() - now;
          const { status: statusCode } = error;
          // 记录请求和响应信息
          this.logger.error(
            `${method} ${url} ${statusCode} ${responseTime}ms ` +
              JSON.stringify({
                request: {
                  ip,
                  method,
                  url,
                  headers: request.headers,
                },
                response: {
                  statusCode,
                  headers: response.getHeaders(),
                  response: error.response,
                },
                stack: error.stack,
              }),
          );
        },
      }),
    );
  }
}
