import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesDevController } from './companies-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "./entity/companies.entity";
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Company]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PORT_USER) ?? 3021,
        },
      },
    ]),
  ],
  controllers: [CompaniesController, CompaniesDevController],
  providers: [CompaniesService]
})
export class CompaniesModule {}
