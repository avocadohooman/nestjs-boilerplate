import { Body, CacheInterceptor, CacheKey, CacheTTL, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { cachedBookmarkKey } from './cache.config';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@UseInterceptors(CacheInterceptor)
@Controller('bookmarks')
export class BookmarkController {
	constructor(private bookmarkService: BookmarkService) {}

	@Get()
	@CacheKey(cachedBookmarkKey)
	@CacheTTL(300)
	getBookmarks(@GetUser(' id') userId: number){
		return this.bookmarkService.getBookmarks(userId);
	}

	@Get(':id')
	getBookmarkById(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) bookmarkId: number
	) {
		return this.bookmarkService.getBookmarkById(userId, bookmarkId);
	}

	@Post('create')
	createBookmark(
		@GetUser('id') userId: number,
		@Body(new ValidationPipe({whitelist: true})) dto: CreateBookmarkDto
	) {
		return this.bookmarkService.createBookmark(userId, dto);
	}

	@Patch('edit/:id')
	editBookmarkById(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) bookmarkId: number,
		@Body(new ValidationPipe({whitelist: true})) dto: EditBookmarkDto
	) {
		return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);

	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('delete/:id')
	deleteBookmarkById(
		@GetUser('id') userId: number,
		@Param('id', ParseIntPipe) bookmarkId: number
	) {
		return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
	}
}
