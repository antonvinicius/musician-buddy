import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "src/auth/interfaces/dtos/login.dto";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    async login(loginDto: LoginDto): Promise<any> {
        const payload = { username: loginDto.username, sub: 1 }

        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}