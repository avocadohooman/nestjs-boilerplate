import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService{

	constructor(private prismaService: DatabaseService) {}
	/*
		Service for POST /auth/signup controller
	*/
	async signup(dto: AuthDto) {
		/*
			generate hash for pw
		*/
		const hashedPassword = await argon.hash(dto.password);
		/*
			save user in db
		*/
		const user = await this.prismaService.user.create({
			data: {
				email: dto.email,
				hash: hashedPassword
			}
		})
		delete user.hash;
		return user;
	}
	/*
		Service for POST /auth/signin controller
	*/
	signin() {
		return 'i am signin';
	}
}