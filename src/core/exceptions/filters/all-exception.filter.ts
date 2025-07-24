import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { DomainExceptionCode } from '../domain-exception-codes';
import { isErrorWithMessage } from './is-error-with-message';
import { ThrottlerException } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = isErrorWithMessage(exception)
      ? exception.message
      : 'Unknown exception occurred.';
    const status =
      exception instanceof ThrottlerException
        ? HttpStatus.TOO_MANY_REQUESTS
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code =
      exception instanceof ThrottlerException
        ? DomainExceptionCode.TooManyRequests
        : DomainExceptionCode.InternalServerError;

    const responseBody = this.buildResponseBody(request.url, message, code);

    response.status(status).json(responseBody);
  }

  private buildResponseBody(
    requestUrl: string,
    message: string,
    code: DomainExceptionCode,
  ): ErrorResponseBody {
    const env = this.configService.getOrThrow<string>('NODE_ENV');
    const isProduction = env === 'production';

    if (isProduction) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: 'Some error occurred',
        extensions: [],
        code,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message,
      extensions: [],
      code,
    };
  }
}
