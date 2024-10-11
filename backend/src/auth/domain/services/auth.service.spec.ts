import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl"
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "../../interfaces/dtos/login.dto"
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "../../interfaces/dtos/register.dto"
import { User } from "@prisma/client"

describe('AuthService', () => {
    let authService: AuthService
    let userRepository: UserRepositoryImpl
    let jwtService: JwtService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserRepositoryImpl,
                    useValue: {
                        findByUsername: jest.fn(),
                        findByEmail: jest.fn(),
                        createUser: jest.fn(),
                        updateRefreshToken: jest.fn()
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn()
                    }
                }
            ]
        }).compile()

        authService = module.get(AuthService)
        userRepository = module.get(UserRepositoryImpl)
        jwtService = module.get(JwtService)
    })

    describe('login', () => {
        it('should return error if username is missing', async () => {
            const loginDto: LoginDto = {
                password: "126345967",
                username: ""
            }

            const response = await authService.login(loginDto)

            expect(response.statusCode).toBe(400)
        });

        it('should return error if password is missing', async () => {
            const loginDto: LoginDto = {
                password: "",
                username: "username"
            }

            const response = await authService.login(loginDto)

            expect(response.statusCode).toBe(400)
        })

        it('should return error if credentials are invalid', async () => {
            const loginDto: LoginDto = {
                password: "126345967",
                username: "vinicius"
            }

            userRepository.findByUsername = jest.fn().mockResolvedValue({
                username: 'vinicius',
                password: 'hashedpassword'
            })

            jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false)

            const response = await authService.login(loginDto)

            expect(response.statusCode).toBe(400)
            expect(response.message).toBe('Invalid credentials')
        })

        it('should return access token if login is success', async () => {
            const loginDto: LoginDto = {
                password: "123456789",
                username: "user1"
            }

            userRepository.findByUsername = jest.fn().mockResolvedValue({
                username: 'user1',
                password: 'hashedpassword'
            })

            jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true)
            jest.spyOn(jwtService, 'sign').mockImplementation(() => 'fake-jwt-token')

            const response = await authService.login(loginDto)

            expect(response.statusCode).toBe(200)
            expect(response.data?.accessToken).toBe('fake-jwt-token')
        })
    })

    describe('register', () => {
        it('should return error if username is missing', async () => {
            const registerDto: RegisterDto = {
                email: 'email@email.com',
                password: '123456789',
                username: ''
            }

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(400)
            expect(response.errors).toContainEqual({ label: 'username', description: 'Username is required' })
        });

        it('should return error if password is missing', async () => {
            const registerDto: RegisterDto = {
                email: 'email@email.com',
                password: '',
                username: 'user1'
            }

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(400)
            expect(response.errors).toContainEqual({ label: 'password', description: 'Password is required' })
        })

        it('should return error if email is missing', async () => {
            const registerDto: RegisterDto = {
                email: '',
                password: '123456789',
                username: 'user1'
            }

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(400)
            expect(response.errors).toContainEqual({ label: 'email', description: 'Email is required' })
        })

        it('should return error if email is invalid format', async () => {
            const registerDto: RegisterDto = {
                email: 'email',
                password: '123456789',
                username: 'user1'
            }

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(400)
            expect(response.errors).toContainEqual({ label: 'email', description: 'Invalid email format' })
        })

        it('should return error if password has less than 6 characters', async () => {
            const registerDto: RegisterDto = {
                email: 'email',
                password: '1234',
                username: 'user1'
            }

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(400)
            expect(response.errors).toContainEqual({ label: 'password', description: 'Password must be at least 6 characters long' })
        })

        it('should return error if username already exists', async () => {
            const registerDto: RegisterDto = {
                email: 'email@email.com',
                password: '123456789',
                username: 'user1'
            }

            jest.spyOn(userRepository, 'findByUsername').mockImplementation(async () => {
                const user: User = {
                    createdAt: new Date(),
                    email: 'email@email.com',
                    id: 'fake-id',
                    password: '123456798',
                    updatedAt: new Date(),
                    username: 'user1',
                    refreshToken: null
                }

                return user
            })

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(400)
            expect(response.errors).toContainEqual({ label: 'username', description: 'Username already exists' })
        })

        it('should return error if email already exists', async () => {
            const registerDto: RegisterDto = {
                email: 'email@email.com',
                password: '123456789',
                username: 'user12'
            }

            jest.spyOn(userRepository, 'findByEmail').mockImplementation(async () => {
                const user: User = {
                    createdAt: new Date(),
                    email: 'email@email.com',
                    id: 'fake-id',
                    password: '123456798',
                    updatedAt: new Date(),
                    username: 'user1',
                    refreshToken: null
                }

                return user
            })

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(400)
            expect(response.errors).toContainEqual({ label: 'email', description: 'Email already exists' })
        })

        it('should create a new user and return success', async () => {
            const registerDto: RegisterDto = {
                email: 'email@email.com',
                password: '123456789',
                username: 'user12'
            }

            jest.spyOn(userRepository, 'createUser').mockImplementation(async () => {
                return {
                    createdAt: new Date(),
                    email: registerDto.email,
                    id: 'some-fake-id',
                    password: registerDto.password,
                    username: registerDto.username,
                    updatedAt: new Date(),
                    refreshToken: null
                }
            })

            const response = await authService.register(registerDto)

            expect(response.statusCode).toBe(201)
        })
    })
})