import { Module } from "@nestjs/common";
import { AuthController } from "./interfaces/controllers/auth.controller";
import { AuthService } from "./domain/services/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./interfaces/strategies/jwt.strategy";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRepositoryImpl } from "./infrastructure/repositories/user.repository.impl";

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, PrismaService, UserRepositoryImpl],
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' }
        }),
    ]
})
export class AuthModule { }