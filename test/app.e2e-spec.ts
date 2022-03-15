import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../src/database/database.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: DatabaseService;
	const PORT = 3333;
	const baseUrl = `http://localhost:${PORT}`

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		await app.init();
		prisma = app.get(DatabaseService);
		await prisma.cleanDb();
		pactum.request.setBaseUrl(baseUrl);
		await app.listen(PORT);
	});

	afterAll(() => {
		app.close();
	});

	describe('Auth', () => {
		const dto: AuthDto = { 
			email: 'gerhard@minimumbadass.com', 
			password: '123456'
		};

		describe('Signup', () => {
			it('should throw error if email is empty', () => {
				return pactum.spec()
					.post(`/auth/signup`)
					.withBody({password: '12345'})
					.expectStatus(400)
			});

			it('should throw error if password is empty', () => {
				return pactum.spec()
					.post(`/auth/signup`)
					.withBody({email: dto.email })
					.expectStatus(400)
			});

			it('should throw error no body provided', () => {
				return pactum.spec()
					.post(`/auth/signup`)
					.expectStatus(400)
			});

			it('should signup', () => {
				return pactum.spec()
					.post(`/auth/signup`)
					.withBody(dto)
					.expectStatus(201)
			});
		});
 
		describe('Signin', () => {
			it('should throw error if email is empty', () => {
				return pactum.spec()
					.post(`/auth/signin`)
					.withBody({password: '12345'})
					.expectStatus(400)
			});

			it('should throw error if password is empty', () => {
				return pactum.spec()
					.post(`/auth/signin`)
					.withBody({email: dto.email })
					.expectStatus(400)
			});

			it('should throw error no body provided', () => {
				return pactum.spec()
					.post(`/auth/signin`)
					.expectStatus(400)
			});

			it('should signin', () => {
				return pactum.spec()
					.post(`/auth/signin `)
					.withBody(dto)
					.expectStatus(200)
			});
		});
	});

	describe('User', () => {
		describe('GetMe', () => {

		});
		describe('EditUser', () => {

		});
	});

	describe('Bookmark', () => {
		describe('Create Bookmark', () => {

		});
		describe('Get Bookmark', () => {

		});
		describe('Get Bookmark by Id', () => {

		});
		describe('Delete Bookmark', () => {

		});
		describe('Edit Bookmark', () => {

		});
	}); 
});
