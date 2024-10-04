import { MusicStatus } from "@prisma/client";

export class UpdateMusicDto {
    name?: string;
    artist?: string;
    genre?: string;
    image?: string;
    status?: MusicStatus;
    instrumentIds?: string[];
}
