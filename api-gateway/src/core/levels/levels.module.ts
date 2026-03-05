import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: 'POINT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.POINT_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_POINT) ?? 3023,
        },
      },
    ]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService]
})
export class LevelsModule {}
