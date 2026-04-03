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
import { CompanyProgramsModule } from './core/company-programs/company-programs.module';
import { LevelsModule } from './core/levels/levels.module';
import { RewardsModule } from './core/rewards/rewards.module';
import { BranchesModule } from './core/branches/branches.module';
import { RewardBranchesModule } from './core/reward-branches/reward-branches.module';
import { ProfilesModule } from './core/profiles/profiles.module';
import { ProfilePermissionsModule } from './core/profile-permissions/profile-permissions.module';
import { CardsModule } from './core/cards/cards.module';
import { EventsModule } from './core/events/events.module';

@Module({
  imports: [UsersModule, UserProfilesModule, PermissionsModule, SecurityEventsModule, LoyaltyProgramsModule, 
    CompaniesModule, EventTypesModule, SecurityLogsModule, ClientsModule, CompanyProgramsModule, LevelsModule, RewardsModule, 
    BranchesModule, RewardBranchesModule, ProfilesModule, ProfilePermissionsModule, CardsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
