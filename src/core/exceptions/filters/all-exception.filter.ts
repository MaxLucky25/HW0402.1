import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { isErrorWithMessage } from './is-error-with-message';
import { ThrottlerException } from '@nestjs/throttler';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = isErrorWithMessage(exception)
      ? exception.message
      : 'Unknown exception occurred.';
    const status =
      exception instanceof ThrottlerException
        ? HttpStatus.TOO_MANY_REQUESTS
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = this.buildResponseBody(message);

    response.status(status).json(responseBody);
  }

  private buildResponseBody(message: string): ErrorResponseBody {
    return {
      errorsMessages: [
        {
          message,
          field: '',
        },
      ],
    };
  }
}
