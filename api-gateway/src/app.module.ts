import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';
import { UserProfilesModule } from './core/user-profiles/user-profiles.module';

@Module({
  imports: [UsersModule, UserProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
