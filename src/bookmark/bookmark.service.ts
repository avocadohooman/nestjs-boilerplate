import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
	constructor(private databaseService: DatabaseService){}

	async getBookmarks(userId: number) {
		const bookmarks = await this.databaseService.bookmark.findMany({
			where: {
				userId: userId,
			}
		});
		return bookmarks;
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
