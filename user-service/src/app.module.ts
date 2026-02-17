import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersModule } from './core/users/users.module';
import { SecurityEventsModule } from './core/security-events/security-events.module';
import { PermissionsModule } from './core/permissions/permissions.module';
import { ProfilesModule } from './core/profiles/profiles.module';
import { ProfilePermissionsModule } from './core/profile-permissions/profile-permissions.module';
import { SecurityLogsModule } from './core/security-logs/security-logs.module';
import { UserProfilesModule } from './core/user-profiles/user-profiles.module';

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
    UsersModule,
    SecurityEventsModule,
    PermissionsModule,
    ProfilesModule,
    ProfilePermissionsModule,
    SecurityLogsModule,
    UserProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
