import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
	constructor(private authService: AuthService) {

	}
	/*
		POST /auth/signup
	*/
	@Post('signup')
	signup() {
		return 'i am signup';
	}
	/*
		POST /auth/sigin
	*/
	@Post('signin')
	signin() {
		return 'i am signin';
	}

}