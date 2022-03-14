import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/*
	Global allows exports to be available to all modules/services in our app
*/
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
