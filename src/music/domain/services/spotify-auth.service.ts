import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as qs from 'qs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SpotifyAuthService {
    private clientId = process.env.SPOTIFY_CLIENT_ID;
    private clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    private authUrl = 'https://accounts.spotify.com/api/token';

    constructor(private readonly httpService: HttpService) { }

    async getAccessToken(): Promise<string> {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' +
                Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
        };

        const data = qs.stringify({ grant_type: 'client_credentials' });

        const response = await lastValueFrom(
            this.httpService.post(this.authUrl, data, { headers })
        );

        return response.data.access_token;
    }
}
