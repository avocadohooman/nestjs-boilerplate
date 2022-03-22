import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
	imports: [CacheModule.register({
		store: redisStore,
		host: 'localhost',
		port: 5003,
	})],
	controllers: [BookmarkController],
	providers: [
		BookmarkService, 
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		}]
})
export class BookmarkModule {}
