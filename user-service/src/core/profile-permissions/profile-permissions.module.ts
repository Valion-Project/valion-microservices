import { Module } from '@nestjs/common';
import { ProfilePermissionsController } from './profile-permissions.controller';
import { ProfilePermissionsService } from './profile-permissions.service';
import { ProfilePermissionsDevController } from './profile-permissions-dev.controller';

@Module({
  controllers: [ProfilePermissionsController, ProfilePermissionsDevController],
  providers: [ProfilePermissionsService]
})
export class ProfilePermissionsModule {}
