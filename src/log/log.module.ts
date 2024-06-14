import { Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { CustomLoggerService } from './custom-logger.service';

@Module({
  imports: [EnvModule],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LogModule {}
