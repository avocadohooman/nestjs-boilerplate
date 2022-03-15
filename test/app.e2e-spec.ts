import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../src/database/database.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

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
					.stores('userToken', 'access_token');
			});
		});
	});

	describe('User', () => {
		describe('GetMe', () => {
			it('should get current user info', () => {
				return pactum.spec()
					.get(`/users/me`)
					/*
						Adding S to $S{} to access the pactum storage
					*/
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.expectStatus(200)
			});

			it('should throw error if token has been not provided', () => {
				return pactum.spec()
					.get(`/users/me`)
					.expectStatus(401)
			});
		});
		describe('EditUser', () => {
			it('should edit the user', () => {
				const editDto: EditUserDto = {
					firstName: 'Gerhard',
					lastName: 'Molin',
				}
				return pactum
					.spec()
					.patch(`/users/edit`)
					.withBody(editDto)
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.expectStatus(200)
					.expectBodyContains(editDto.firstName)
					.expectBodyContains(editDto.lastName)
			});
		});
	});

	describe('Bookmark', () => {
		describe('Get empty bookmarks', () => {
			it('should returns empty array of bookmarks', () => {
				return pactum
					.spec() 
					.get(`/bookmarks`)
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.expectStatus(200)
					.expectBodyContains([])
			});
		});
		describe('Create Bookmark', () => {
			it('should create a bookmark', () => {
				const createBookmark: CreateBookmarkDto = {
					title: 'NestJS 101',
					description: 'a tutorial',
					link: 'https://www.youtube.com/watch?v=GHTA143_b-s',
				}
				return pactum
					.spec() 
					.post(`/bookmarks/create`)
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.withBody(createBookmark)
					.expectStatus(201)
					.expectBodyContains(createBookmark.title)
			})
		});
		describe('Get Bookmarks', () => {

		});
		describe('Get Bookmark by Id', () => {

		});
		describe('Delete Bookmark by id', () => {

		});
		describe('Edit Bookmark by id', () => {

		});
	}); 
});
