import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateMusicDto } from '../../interfaces/dtos/create-music.dto';
import { UpdateMusicDto } from '../../interfaces/dtos/update-music.dto';
import { MusicStatus } from '@prisma/client';
import { ApiResponse, ApiError } from '../../../shared/utils/response.util';

export interface MusicQuery {
    status: MusicStatus | undefined;
    instrumentId: string | undefined;
}

@Injectable()
export class MusicService {
    constructor(private readonly prisma: PrismaService) { }

    async createMusic(createMusicDto: CreateMusicDto, userId: string): Promise<ApiResponse> {
        const errors: ApiError[] = [];

        console.log(userId)

        if (!createMusicDto.name) {
            errors.push({ label: 'name', description: 'Music name is required' });
        }
        if (!createMusicDto.artist) {
            errors.push({ label: 'artist', description: 'Artist name is required' });
        }
        if (!createMusicDto.genre) {
            errors.push({ label: 'genre', description: 'Genre is required' });
        }
        if (!createMusicDto.image) {
            errors.push({ label: 'image', description: 'Image is required' });
        }
        if (!createMusicDto.instrumentIds || createMusicDto.instrumentIds.length === 0) {
            errors.push({ label: 'instrumentIds', description: 'At least one instrument is required' });
        }

        if (errors.length > 0) {
            return {
                message: 'Validation failed',
                errors,
                statusCode: 400,
                data: null,
            };
        }

        const existingMusic = await this.prisma.music.findFirst({
            where: {
                name: createMusicDto.name,
                artist: createMusicDto.artist,
                userId,
            },
        });

        if (existingMusic) {
            return {
                message: 'Music already exists',
                errors: [
                    {
                        label: 'name',
                        description: `Music with name "${createMusicDto.name}" by artist "${createMusicDto.artist}" already exists for this user`,
                    },
                ],
                statusCode: 400,
                data: null,
            };
        }

        const music = await this.prisma.music.create({
            data: {
                name: createMusicDto.name,
                artist: createMusicDto.artist,
                genre: createMusicDto.genre,
                image: createMusicDto.image,
                status: createMusicDto.status || MusicStatus.LEARNING,
                userId,
                instruments: {
                    connect: createMusicDto.instrumentIds.map((id) => ({ id })),
                },
            },
        });

        return {
            message: 'Music created successfully',
            errors: [],
            statusCode: 201,
            data: music,
        };
    }

    async getMusicsByUser(userId: string, query: MusicQuery = null): Promise<ApiResponse> {
        const musics = await this.prisma.music.findMany({
            where: {
                userId,
                status: query.status,
                instruments: {
                    some: {
                        id: query.instrumentId
                    }
                }
            },
            include: { instruments: true },
        });

        return {
            message: 'Musics retrieved successfully',
            errors: [],
            statusCode: 200,
            data: musics,
        };
    }

    async updateMusic(id: string, userId: string, updateMusicDto: UpdateMusicDto): Promise<ApiResponse> {
        const errors: ApiError[] = [];

        const music = await this.prisma.music.findUnique({
            where: { id },
        });

        if (!music) {
            return {
                message: 'Music not found',
                errors: [{ label: 'id', description: 'Music not found' }],
                statusCode: 404,
                data: null,
            };
        }

        if (music.userId !== userId) {
            return {
                message: 'Forbidden',
                errors: [{ label: 'id', description: 'You do not have permission to update this music' }],
                statusCode: 403,
                data: null,
            };
        }

        if (updateMusicDto.name && updateMusicDto.name.trim() === '') {
            errors.push({ label: 'name', description: 'Music name cannot be empty' });
        }
        if (updateMusicDto.artist && updateMusicDto.artist.trim() === '') {
            errors.push({ label: 'artist', description: 'Artist name cannot be empty' });
        }
        if (updateMusicDto.genre && updateMusicDto.genre.trim() === '') {
            errors.push({ label: 'genre', description: 'Genre cannot be empty' });
        }
        if (updateMusicDto.image && updateMusicDto.image.trim() === '') {
            errors.push({ label: 'image', description: 'Image cannot be empty' });
        }

        if (errors.length > 0) {
            return {
                message: 'Validation failed',
                errors,
                statusCode: 400,
                data: null,
            };
        }

        const { instrumentIds, ...dataToUpdate } = updateMusicDto;

        const updatedMusic = await this.prisma.music.update({
            where: { id },
            data: {
                ...dataToUpdate,
                instruments: updateMusicDto.instrumentIds
                    ? {
                        set: updateMusicDto.instrumentIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
        });

        return {
            message: 'Music updated successfully',
            errors: [],
            statusCode: 200,
            data: updatedMusic,
        };
    }

    async deleteMusic(id: string, userId: string): Promise<ApiResponse> {
        const music = await this.prisma.music.findUnique({
            where: { id },
        });

        if (!music) {
            return {
                message: 'Music not found',
                errors: [{ label: 'id', description: 'Music not found' }],
                statusCode: 404,
                data: null,
            };
        }

        if (music.userId !== userId) {
            return {
                message: 'Forbidden',
                errors: [{ label: 'id', description: 'You do not have permission to delete this music' }],
                statusCode: 403,
                data: null,
            };
        }

        await this.prisma.music.delete({
            where: { id },
        });

        return {
            message: 'Music deleted successfully',
            errors: [],
            statusCode: 200,
            data: null,
        };
    }
}
