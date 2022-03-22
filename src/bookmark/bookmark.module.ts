import { CacheModule, Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
	imports: [CacheModule.register({
		store: redisStore,
		host: 'localhost',
		port: 5003,
	})],
	controllers: [BookmarkController],
	providers: [BookmarkService]
})
export class BookmarkModule {}
