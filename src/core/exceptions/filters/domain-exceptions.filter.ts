import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DomainException } from '../domain-exceptions';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { mapDomainCodeToHttpStatus } from './map-domain-code-to-http-status';

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = mapDomainCodeToHttpStatus(exception.code);
    const responseBody = this.buildResponseBody(exception, request.url);

    response.status(status).json(responseBody);
  }

  private buildResponseBody(
    exception: DomainException,
    requestUrl: string,
  ): ErrorResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message: exception.message,
      code: exception.code,
      extensions: exception.extensions,
    };
  }
}
