import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
