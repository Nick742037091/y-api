import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result: any) => {
        if (result && (result.code || result.msg)) {
          // 存在code和msg的返回值，是异常返回
          return {
            code: 0 || result.code,
            data: result.data || null,
            msg: result.msg || '',
          };
        } else {
          return {
            code: 0,
            data: result,
            msg: '操作成功',
          };
        }
      }),
    );
  }
}
