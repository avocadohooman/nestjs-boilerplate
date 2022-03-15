import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../src/database/database.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
		const createBookmark: CreateBookmarkDto = {
			title: 'NestJS 101',
			description: 'a tutorial',
			link: 'https://www.youtube.com/watch?v=GHTA143_b-s',
		}

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
				return pactum
					.spec() 
					.post(`/bookmarks/create`)
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.withBody(createBookmark)
					.expectStatus(201)
					.expectBodyContains(createBookmark.title)
					.stores('bookmarkId', 'id');
			})
		});

		describe('Get Bookmarks', () => {
			it('should return the created bookmark', () => {
				return pactum
					.spec() 
					.get(`/bookmarks`)
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.expectStatus(200)
					.expectBodyContains(createBookmark.title)
					.expectBodyContains(createBookmark.link)
					.expectBodyContains(createBookmark.description)
			});
		});

		describe('Get Bookmark by Id', () => {
			it('should get one specific bookmark', () => {
				return pactum
					.spec() 
					.get(`/bookmarks/{id}`)
					.withPathParams('id', '$S{bookmarkId}')
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.expectStatus(200)
					.expectBodyContains(createBookmark.title)
					.expectBodyContains(createBookmark.link)
					.expectBodyContains(createBookmark.description)
			});
		});
		
		describe('Edit Bookmark by id', () => {
			it('should edit bookmark by id', () => {
				const updatedBookmark: EditBookmarkDto = { title: 'A NestJs Tutorial!'};
				return pactum
					.spec() 
					.patch(`/bookmarks/edit/{id}`)  
					.withPathParams('id', '$S{bookmarkId}')
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.withBody(updatedBookmark)
					.expectStatus(200)
					.expectBodyContains(updatedBookmark.title)
					.expectBodyContains(createBookmark.link)
					.expectBodyContains(createBookmark.description) 
			});
		});

		describe('Delete Bookmark by id', () => {
			it('should delete bookmark by id', () => {
				return pactum
					.spec() 
					.delete(`/bookmarks/delete/{id}`)  
					.withPathParams('id', '$S{bookmarkId}')
					.withHeaders({
						Authorization: `Bearer $S{userToken}`
					})
					.expectStatus(204)
			});

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
	}); 
});
