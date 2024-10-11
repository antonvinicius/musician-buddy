import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import { LoginDto } from "../../interfaces/dtos/login.dto";
import * as bcrypt from 'bcrypt'
import { RegisterDto } from "../../interfaces/dtos/register.dto";
import { ApiError, ApiResponse } from "../../../shared/utils/response.util";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepositoryImpl
    ) { }

    async login(loginDto: LoginDto): Promise<ApiResponse> {
        const errors: ApiError[] = []

        if (!loginDto.username) errors.push({ label: 'username', description: 'Username is required' })
        if (!loginDto.password) errors.push({ label: 'password', description: 'Password is required' })

        if (errors.length > 0) {
            return {
                errors,
                message: "Invalid request format",
                statusCode: 400
            }
        }

        const user = await this.userRepository.findByUsername(loginDto.username)

        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            return {
                errors: [],
                message: "Invalid credentials",
                statusCode: 400
            }
        }

        const payload = { username: user.username, sub: user.id }

        const accessToken = this.jwtService.sign(payload)
        const refreshToken = this.generateRefreshToken(user.id)

        await this.userRepository.updateRefreshToken(user.id, refreshToken)

        return {
            data: {
                accessToken,
                refreshToken
            },
            errors: [],
            message: "Login successful",
            statusCode: 200
        }
    }

    async register(registerDto: RegisterDto): Promise<ApiResponse> {
        const errors: ApiError[] = []

        if (!registerDto.username) errors.push({ label: 'username', description: 'Username is required' })
        if (!registerDto.password) errors.push({ label: 'password', description: 'Password is required' })
        if (!registerDto.email) errors.push({ label: 'email', description: 'Email is required' })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (registerDto.email && !emailRegex.test(registerDto.email)) {
            errors.push({ label: 'email', description: 'Invalid email format' })
        }

        if (registerDto.password && registerDto.password.length < 6) {
            errors.push({ label: 'password', description: 'Password must be at least 6 characters long' })
        }

        const existingUserByUsername = await this.userRepository.findByUsername(registerDto.username)
        if (existingUserByUsername) {
            errors.push({ label: 'username', description: 'Username already exists' })
        }

        const existingUserByEmail = await this.userRepository.findByEmail(registerDto.email)
        if (existingUserByEmail) {
            errors.push({ label: 'email', description: 'Email already exists' })
        }

        if (errors.length > 0) {
            return {
                errors,
                message: "Register failed",
                statusCode: 400,
            }
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10)
        const createdUser = await this.userRepository.createUser(registerDto.username, registerDto.email, hashedPassword)

        return {
            errors: [],
            message: "Register successful",
            statusCode: 201,
            data: createdUser.id
        }
    }

    generateRefreshToken(userId: String) {
        return this.jwtService.sign({ sub: userId }, { expiresIn: '7d' })
    }

    async refreshAccessToken(refreshToken: string): Promise<ApiResponse> {
        const errors: ApiError[] = [];

        if (!refreshToken) {
            errors.push({ label: 'refreshToken', description: 'Refresh token is required' });
            return {
                errors,
                message: "Refresh token required",
                statusCode: 400,
            };
        }

        try {
            const decoded = this.jwtService.verify(refreshToken);
            const userId = decoded.sub;

            const user = await this.userRepository.findById(userId);
            if (!user || user.refreshToken !== refreshToken) {
                return {
                    errors: [{ label: 'refreshToken', description: 'Invalid refresh token' }],
                    message: "Invalid refresh token",
                    statusCode: 401,
                };
            }

            const newAccessToken = this.jwtService.sign({ username: user.username, sub: user.id });
            const newRefreshToken = this.generateRefreshToken(user.id)

            this.userRepository.updateRefreshToken(user.id, newRefreshToken)

            return {
                data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
                errors: [],
                message: "Token refreshed successfully",
                statusCode: 200,
            };
        } catch (error) {
            return {
                errors: [{ label: 'refreshToken', description: 'Invalid or expired refresh token' }],
                message: "Invalid or expired refresh token",
                statusCode: 401,
            };
        }
    }
}