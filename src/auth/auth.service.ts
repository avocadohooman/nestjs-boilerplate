import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class AuthService{

	constructor(private prismaService: DatabaseService) {}
	/*
		Service for POST /auth/signup controller
	*/
	signup() {
		return 'i am signup';
	}
	/*
		Service for POST /auth/signin controller
	*/
	signin() {
		return 'i am signin';
	}
}