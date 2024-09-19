import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { AuthService } from "src/auth/domain/services/auth.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile() {
        return { message: 'yeeeeah' }
    }
}