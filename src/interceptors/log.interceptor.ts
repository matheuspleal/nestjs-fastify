import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from '../log/custom-logger.service';
// import { Request, Response } from 'express';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest<Request>();
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const { method, url } = request;
    return next.handle().pipe(
      tap((responseBody) => {
        // const response = context.switchToHttp().getResponse<Response>();
        const response = context.switchToHttp().getResponse<FastifyReply>();
        const logMessage = {
          request: {
            method,
            url,
            queryParams: request.query,
            headers: request.headers,
            body: request.body,
          },
          response: {
            headers: response.getHeaders(),
            httpCode: response.statusCode,
            body: responseBody,
          },
        };
        this.logger.log(logMessage, [
          'HTTP_REQUEST',
          String(response.statusCode),
        ]);
      }),
    );
  }
}
