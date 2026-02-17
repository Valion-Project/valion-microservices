import { Module } from '@nestjs/common';
import { SecurityLogsController } from './security-logs.controller';
import { SecurityLogsService } from './security-logs.service';
import { SecurityLogsDevController } from './security-logs-dev.controller';

@Module({
  controllers: [SecurityLogsController, SecurityLogsDevController],
  providers: [SecurityLogsService]
})
export class SecurityLogsModule {}
