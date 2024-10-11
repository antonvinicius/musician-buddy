import { MusicStatus } from "@prisma/client";

export class CreateMusicDto {
    name: string;
    artist: string;
    genre: string;
    image: string;
    status?: MusicStatus;
    instrumentIds: string[];
}
