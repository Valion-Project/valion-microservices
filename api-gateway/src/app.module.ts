import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';
import { UserProfilesModule } from './core/user-profiles/user-profiles.module';
import { PermissionsModule } from './core/permissions/permissions.module';
import { SecurityEventsModule } from './core/security-events/security-events.module';
import { LoyaltyProgramsModule } from './core/loyalty-programs/loyalty-programs.module';
import { CompaniesModule } from './core/companies/companies.module';
import { EventTypesModule } from './core/event-types/event-types.module';
import { SecurityLogsModule } from './core/security-logs/security-logs.module';
import { ClientsModule } from './core/clients/clients.module';

@Module({
  imports: [UsersModule, UserProfilesModule, PermissionsModule, SecurityEventsModule, LoyaltyProgramsModule, CompaniesModule, EventTypesModule, SecurityLogsModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
