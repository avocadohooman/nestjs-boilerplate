import { IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class EditBookmarkDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	@IsUrl()
	link?: string;
}