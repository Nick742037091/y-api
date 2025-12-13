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
          // result是对象，且存在code和msg的属性，返回结果需要从返回值提取code、data、msg属性
          return {
            code: 0 || result.code,
            data: result.data || null,
            msg: result.msg || '',
          };
        } else {
          // 其他情况，将result作为返回结果的data属性返回
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
