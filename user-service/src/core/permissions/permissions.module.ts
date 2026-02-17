import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Permission} from "./entity/permissions.entity";
import { PermissionsDevController } from './permissions-dev.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission])
  ],
  controllers: [PermissionsController, PermissionsDevController],
  providers: [PermissionsService]
})
export class PermissionsModule {}
