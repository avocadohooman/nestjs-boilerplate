import { ForbiddenException, Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { Cache } from 'cache-manager';

@Injectable()
export class BookmarkService {
	constructor(
		private databaseService: DatabaseService, 
		@Inject(CACHE_MANAGER) private cacheManager: Cache){}

	async getBookmarks(userId: number) {
		const cachedBookmarksKey = 'cached-bookmarks';
		const cachecBookmarks = await this.cacheManager.get(cachedBookmarksKey);
		if (cachecBookmarks) {
			return {
				data: cachecBookmarks,
				from: 'redis-cache',
			};
		}
		const bookmarks = await this.databaseService.bookmark.findMany({
			where: {
				userId: userId,
			}
		});
		await this.cacheManager.set(cachedBookmarksKey, bookmarks, {ttl: 300});
		return {
			data: bookmarks,
			from: 'db',
		};
	}

	async createBookmark(userId: number, dto: CreateBookmarkDto) {
		try {
			const bookmark = await this.databaseService.bookmark.create({
				data: {
					userId: userId,
					...dto,
				}
			});
			return bookmark;
		} catch (error) {
			throw error;
		}
	}

	async getBookmarkById(userId: number, bookmarkId: number) {
		const bookmark = await this.databaseService.bookmark.findFirst({
			where: {
				id: bookmarkId,
				userId: userId
			}
		})
		return bookmark;
	}

	async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
		const bookmark = await this.databaseService.bookmark.findUnique({
			where: {
				id: bookmarkId,
			}
		})
		if (!bookmark || bookmark.userId !== userId) throw new ForbiddenException('access to resource denied');
		return this.databaseService.bookmark.update({
			where: {
				id: bookmarkId,
			},
			data: {
				...dto
			}
		});
	}

	async deleteBookmarkById(userId: number, bookmarkId: number) {
		const bookmark = await this.databaseService.bookmark.findUnique({
			where: {
				id: bookmarkId,
			}
		})
		if (!bookmark || bookmark.userId !== userId) throw new ForbiddenException('access to resource denied');
		return this.databaseService.bookmark.delete({
			where: {
				id: bookmarkId
			}
		});
	}
}
