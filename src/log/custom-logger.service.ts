import { LoggerService, Injectable, Scope } from '@nestjs/common';
import pino from 'pino';
import PinoPretty from 'pino-pretty';

import { EnvService } from '../env/env.service';

export type LogLevel = 'warning' | 'critical' | 'fatal' | 'debug' | 'info';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor(private readonly envService: EnvService) {
    const stream = PinoPretty({
      colorize: true,
      colorizeObjects: true,
      translateTime: 'UTC:yyyy-mm-dd"T"HH:MM:ss"Z"',
    });
    this.logger = pino(
      {
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      stream,
    );
  }

  log(message: any, tags: string[]) {
    this.logMessage('info', message, tags);
  }

  error(message: string, tags: string[]) {
    this.logMessage('fatal', message, tags);
  }

  warn(message: string, tags: string[]) {
    this.logMessage('warning', message, tags);
  }

  debug(message: string, tags: string[]) {
    this.logMessage('debug', message, tags);
  }

  private logMessage(level: LogLevel, message: string, tags: string[]) {
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      message,
      channel: 'default',
      application: 'nestjs-fastify',
      environment: this.envService.get('NODE_ENV'),
      tags,
    };
    this.logger[level](logObject);
  }
}
