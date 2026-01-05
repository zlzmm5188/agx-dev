import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, ErrorCode } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code = ErrorCode.PARAM_ERROR;
    let msg = '服务器内部错误';
    let httpStatus = HttpStatus.OK;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      httpStatus = HttpStatus.OK; // 业务错误也返回 200

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        if (typeof resp['code'] === 'number') {
          code = resp['code'];
          msg = (resp['msg'] as string) || msg;
        } else if (typeof resp['message'] === 'string') {
          msg = resp['message'];
        } else if (Array.isArray(resp['message'])) {
          msg = resp['message'].join(', ');
        }
      } else if (typeof exceptionResponse === 'string') {
        msg = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      msg = exception.message;
      console.error('Unhandled exception:', exception);
    }

    response.status(httpStatus).json(ApiResponse.error(code, msg));
  }
}
