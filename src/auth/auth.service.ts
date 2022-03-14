import { Injectable } from "@nestjs/common";

@Injectable({})

export class AuthService{

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