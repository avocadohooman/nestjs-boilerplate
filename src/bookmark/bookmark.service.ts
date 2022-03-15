import { Injectable } from '@nestjs/common';
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
		console.log('dto', dto);
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

	}

	async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto){}

	async deleteBookmarkById(userId: number, bookmarkId: number){}
}
