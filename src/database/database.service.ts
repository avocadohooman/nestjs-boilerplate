import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
	constructor (config: ConfigService) {
		/*
			super calls the constructer of the extending class, in this case PrismaClient
		*/
		super({
			datasources: {
				db: {
					url: config.get('DATABASE_URL'),
				}
			}
		})
	}

	cleanDb() {
		/*
			$transaction allows to pipe queries in a specific order
		*/
		return this.$transaction([
			this.bookmark.deleteMany(),
			this.user.deleteMany(),
		]);
	}
}
