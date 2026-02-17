import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { CompaniesModule } from './core/companies/companies.module';
import { CompanyProgramsModule } from './core/company-programs/company-programs.module';
import { BranchesModule } from './core/branches/branches.module';
import { LoyaltyProgramsModule } from './core/loyalty-programs/loyalty-programs.module';
import {LevelsModule} from "./core/levels/levels.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CompaniesModule,
    LevelsModule,
    CompanyProgramsModule,
    BranchesModule,
    LoyaltyProgramsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
