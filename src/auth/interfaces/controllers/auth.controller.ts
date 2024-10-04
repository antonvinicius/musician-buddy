import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { AuthService } from "../../domain/services/auth.service";
import { RegisterDto } from "../dtos/register.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshAccessToken(refreshToken)
    }


    // @UseGuards(JwtAuthGuard)
    // @Get('profile')
    // getProfile() {
    //     return { message: 'yeeeeah' }
    // }
}