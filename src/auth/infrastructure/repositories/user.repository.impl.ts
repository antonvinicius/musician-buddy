import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UserRepositoryImpl {
    constructor(private readonly prismaService: PrismaService) { }

    async findByUsername(username: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where: { username }
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where: { email }
        })
    }

    async createUser(username: string, email: string, password: string): Promise<User> {
        return this.prismaService.user.create({
            data: {
                username,
                email,
                password
            }
        })
    }
}