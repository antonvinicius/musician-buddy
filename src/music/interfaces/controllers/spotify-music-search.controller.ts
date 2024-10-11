import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SpotifyMusicSearchService } from '../../domain/services/spotify-music-search.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from 'src/shared/utils/response.util';
import { Request } from 'express';

@Controller('spotify-music-search')
@UseGuards(AuthGuard('jwt'))
export class SpotifyMusicSearchController {
    constructor(private readonly spotifyMusicSearchService: SpotifyMusicSearchService) { }

    @Get()
    async searchMusic(
        @Query('q') query: string,
        @Query('limit') limit: string,
        @Query('offset') offset: string,
        @Req() req: Request
    ): Promise<ApiResponse> {
        const limitParsed = limit ? parseInt(limit, 10) : 10;
        const offsetParsed = offset ? parseInt(offset, 10) : 0;
        const backendBaseUrl = `${req.protocol}://${req.get('host')}`;

        return this.spotifyMusicSearchService.searchMusic(query, limitParsed, offsetParsed, backendBaseUrl);
    }
}
