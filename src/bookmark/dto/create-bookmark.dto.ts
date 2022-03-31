import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@IsUrl()
	link: string;
}