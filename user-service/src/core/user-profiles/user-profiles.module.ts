import { Module } from '@nestjs/common';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';
import { UserProfilesDevController } from './user-profiles-dev.controller';

@Module({
  controllers: [UserProfilesController, UserProfilesDevController],
  providers: [UserProfilesService]
})
export class UserProfilesModule {}
