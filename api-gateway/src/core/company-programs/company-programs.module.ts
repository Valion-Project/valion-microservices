import { Module } from '@nestjs/common';
import { CompanyProgramsController } from './company-programs.controller';
import { CompanyProgramsService } from './company-programs.service';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_ADMIN) ?? 3022,
        },
      },
    ]),
  ],
  controllers: [CompanyProgramsController],
  providers: [CompanyProgramsService]
})
export class CompanyProgramsModule {}
