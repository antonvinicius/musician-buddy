import { INestApplication } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { RegisterDto } from "../src/auth/interfaces/dtos/register.dto";
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        prisma = moduleFixture.get(PrismaService)

        await prisma.user.deleteMany()

        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('/auth/register (POST)', async () => {
        const registerDto: RegisterDto = {
            email: 'email@email.com',
            password: '123456789',
            username: 'user1'
        }

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(201)

        expect(response.body.statusCode).toBe(201)
    })
})