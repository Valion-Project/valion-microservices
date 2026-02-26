import { Module } from '@nestjs/common';
import { SecurityLogsController } from './security-logs.controller';
import { SecurityLogsService } from './security-logs.service';
import { SecurityLogsDevController } from './security-logs-dev.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SecurityLog} from "./entity/security-logs.entity";
import {User} from "../users/entity/users.entity";
import {SecurityEvent} from "../security-events/entity/security-events.entity";
import {MailService} from "../../mail/mail.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityLog, User, SecurityEvent])
  ],
  controllers: [SecurityLogsController, SecurityLogsDevController],
  providers: [SecurityLogsService, MailService]
})
export class SecurityLogsModule {}
