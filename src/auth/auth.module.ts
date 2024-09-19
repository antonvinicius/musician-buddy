import { Module } from "@nestjs/common";
import { AuthController } from "./interfaces/controllers/auth.controller";
import { AuthService } from "./domain/services/auth.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }