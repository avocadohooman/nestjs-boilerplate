import { ForbiddenException, Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{

	constructor(
		private prismaService: DatabaseService, 
		private jwtService: JwtService,
		private config: ConfigService) {}
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
			return this.signToken(user.id, user.email);
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
		return this.signToken(userInDb.id, userInDb.email);
	}

	async signToken(userId: number, email: string):Promise<{ access_token: string}> {
		const payload = {
			sub: userId,
			email,
		}
		const token = await this.jwtService.signAsync(payload, {expiresIn: '15m', secret: this.config.get('JWT_SECRET')});
		return {
			access_token: token,
		};
	}
}