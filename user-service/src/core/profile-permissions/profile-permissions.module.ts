import { Module } from '@nestjs/common';
import { ProfilePermissionsController } from './profile-permissions.controller';
import { ProfilePermissionsService } from './profile-permissions.service';
import { ProfilePermissionsDevController } from './profile-permissions-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProfilePermission} from "./entity/profile-permissions.entity";
import {Profile} from "../profiles/entity/profiles.entity";
import {Permission} from "../permissions/entity/permissions.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePermission, Profile, Permission])
  ],
  controllers: [ProfilePermissionsController, ProfilePermissionsDevController],
  providers: [ProfilePermissionsService]
})
export class ProfilePermissionsModule {}
