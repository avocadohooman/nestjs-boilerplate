import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from "@nestjs/common";
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
	signup(@Body(new ValidationPipe({
		/*
			whitelist strips out any fields in the body request that are not defined
			by our DTO 
		*/
		whitelist: true,
	})) dto: AuthDto) {
		return this.authService.signup(dto);
	}
	/*
		POST /auth/sigin
	*/
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body(new ValidationPipe({
		/*
			whitelist strips out any fields in the body request that are not defined
			by our DTO 
		*/
		whitelist: true,
	})) dto: AuthDto) {
		return this.authService.signin(dto);
	}
}