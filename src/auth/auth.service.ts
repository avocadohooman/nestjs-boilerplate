import { ForbiddenException, Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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
		try {
			const user = await this.prismaService.user.create({
				data: {
					email: dto.email,
					hash: hashedPassword
				}
			})
			delete user.hash;
			return user;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') throw new ForbiddenException('Credentials taken')
			}
			throw error;
		}

	}
	/*
		Service for POST /auth/signin controller
	*/
	async signin(dto: AuthDto) {
		const userInDb = await this.prismaService.user.findFirst({
			where: { 
				email: dto.email,
			}
		});
		if (!userInDb) throw new ForbiddenException('Credentials incorrect');
		const pwMatches = await argon.verify(userInDb.hash, dto.password);
		if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
		delete userInDb.hash;
		return userInDb;
	}
}