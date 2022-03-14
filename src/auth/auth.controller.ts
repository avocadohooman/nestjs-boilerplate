import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
	constructor(private authService: AuthService) {

	}
	/*
		POST /auth/signup
	*/
	@Post('signup')
	signup(@Body(new ValidationPipe()) dto: AuthDto) {
		console.log('dto', dto);
		return this.authService.signup();
	}
	/*
		POST /auth/sigin
	*/
	@Post('signin')
	signin() {
		return this.authService.signin();
	}
}