import { Module } from "@nestjs/common";
import { MusicController } from "./interfaces/controllers/music.controller";
import { MusicService } from "./domain/services/music.service";
import { PrismaService } from "prisma/prisma.service";

@Module({
    controllers: [MusicController],
    providers: [MusicService, PrismaService]
})
export class MusicModule { }