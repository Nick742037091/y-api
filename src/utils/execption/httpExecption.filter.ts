import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

@Catch()
export class HttpExecptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // console.log('http error', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (!(exception instanceof HttpException)) {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).json({
        code: status,
        msg: '服务器异常',
        data: null,
      });
      return;
    }
    const status = exception.getStatus();
    const res = exception.getResponse() as { message: string[] };

    response.status(status).json({
      code: status,
      msg: res?.message?.join ? res?.message?.join(',') : exception.message,
      data: null,
    });
  }
}
