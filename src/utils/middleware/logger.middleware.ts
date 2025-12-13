import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * 日志中间件，记录请求和响应信息
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  use(req: Request, res: Response, next: NextFunction) {
    // 记录请求开始时间
    const startTime = Date.now();

    // 保存原始的res.end方法
    const originalEnd = res.end;
    let responseBody = '';

    // 重写res.end方法以捕获响应内容
    res.end = function (chunk?: any, encoding?: any) {
      if (chunk) {
        responseBody += chunk.toString();
      }

      // 计算响应时间
      const responseTime = Date.now() - startTime;

      // 记录请求和响应信息
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`,
        JSON.stringify({
          request: {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
          },
          response: {
            statusCode: res.statusCode,
            headers: res.getHeaders(),
            body: JSON.parse(responseBody),
          },
        }),
      );

      // 调用原始的end方法
      return originalEnd.call(this, chunk, encoding);
    };

    next();
  }
}
