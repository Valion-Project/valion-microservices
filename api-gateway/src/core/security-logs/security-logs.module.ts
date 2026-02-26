import { Module } from '@nestjs/common';
import { SecurityLogsController } from './security-logs.controller';
import { SecurityLogsService } from './security-logs.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_USERS) ?? 3021,
        },
      },
    ]),
  ],
  controllers: [SecurityLogsController],
  providers: [SecurityLogsService]
})
export class SecurityLogsModule {}
