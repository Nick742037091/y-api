import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class HttpExecptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
