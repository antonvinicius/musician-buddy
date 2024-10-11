import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpotifyAuthService } from './spotify-auth.service';
import { ApiResponse } from 'src/shared/utils/response.util';

@Injectable()
export class SpotifyMusicSearchService {
    private SPOTIFY_API_URL = 'https://api.spotify.com/v1/search';

    constructor(
        private readonly httpService: HttpService,
        private readonly spotifyAuthService: SpotifyAuthService
    ) { }

    async searchMusic(
        query: string,
        limit = 10,
        offset = 0,
        backendBaseUrl: string
    ): Promise<ApiResponse> {
        if (!query || query.trim() === '') {
            return {
                message: 'Validation failed',
                errors: [{ label: 'query', description: 'Search query is required' }],
                statusCode: 400,
                data: null,
            };
        }

        try {
            const token = await this.spotifyAuthService.getAccessToken();

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await lastValueFrom(
                this.httpService
                    .get(this.SPOTIFY_API_URL, {
                        headers,
                        params: {
                            q: query,
                            type: 'track',
                            limit: limit.toString(),
                            offset: offset.toString(),
                        },
                    })
                    .pipe(map((res) => res.data))
            );

            const tracks = response.tracks.items.map((track: any) => ({
                name: track.name,
                artist: track.artists.map((artist: any) => artist.name).join(', '),
                genre: '', 
                image: track.album.images[0]?.url || null, 
                status: 'WANT_TO_LEARN',
                instrumentIds: [],
            }));

            const nextOffset = offset + limit;
            const prevOffset = offset - limit < 0 ? 0 : offset - limit;

            const next = nextOffset < response.tracks.total
                ? `${backendBaseUrl}/spotify-music-search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${nextOffset}`
                : null;

            const previous = offset > 0
                ? `${backendBaseUrl}/spotify-music-search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${prevOffset}`
                : null;

            return {
                message: 'Search successful',
                errors: [],
                statusCode: 200,
                data: {
                    items: tracks,
                    total: response.tracks.total,
                    next,
                    previous
                },
            };
        } catch (error) {
            return {
                message: 'Search failed',
                errors: [{ label: 'api', description: 'Failed to fetch music data from Spotify' }],
                statusCode: 500,
                data: null,
            };
        }
    }
}
