import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
	constructor () {
		/*
			super calls the constructer of the extending class, in this case PrismaClient
		*/
		super({
			datasources: {
				db: {
					url: 'postgresql://postgres:postgres2021@localhost:5432/boilerplate?schema=public',
				}
			}
		})
	}
}
