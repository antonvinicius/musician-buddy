import { Module } from "@nestjs/common";
import { MusicController } from "./interfaces/controllers/music.controller";
import { MusicService } from "./domain/services/music.service";
import { PrismaService } from "prisma/prisma.service";
import { SpotifyAuthService } from "./domain/services/spotify-auth.service";
import { SpotifyMusicSearchService } from "./domain/services/spotify-music-search.service";
import { SpotifyMusicSearchController } from "./interfaces/controllers/spotify-music-search.controller";
import { HttpModule } from "@nestjs/axios";
import { InstrumentService } from "./domain/services/instrument.service";
import { InstrumentController } from "./interfaces/controllers/instrument.controller";

@Module({
    imports: [HttpModule],
    controllers: [MusicController, SpotifyMusicSearchController, InstrumentController],
    providers: [MusicService, PrismaService, SpotifyAuthService, SpotifyMusicSearchService, InstrumentService]
})
export class MusicModule { }