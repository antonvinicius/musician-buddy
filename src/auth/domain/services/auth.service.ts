import { Injectable } from "@nestjs/common";
import { LoginDto } from "src/auth/interfaces/dtos/login.dto";

@Injectable()
export class AuthService {
    async login(loginDto: LoginDto): Promise<any> {
        return { accessToken: 'fake-jwt-token' }
    }
}