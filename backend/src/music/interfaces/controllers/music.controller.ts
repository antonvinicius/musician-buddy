import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { MusicService } from '../../domain/services/music.service';
import { CreateMusicDto } from '../dtos/create-music.dto';
import { UpdateMusicDto } from '../dtos/update-music.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../auth/interfaces/decorators/get-user.decorator';
import { AuthUser } from '../../../shared/dtos/auth-user.dto';
import { MusicStatus } from '@prisma/client';

@Controller('music')
@UseGuards(AuthGuard('jwt'))
export class MusicController {
    constructor(private readonly musicService: MusicService) { }

    @Post()
    async createMusic(@Body() createMusicDto: CreateMusicDto, @GetUser() user: AuthUser) {
        return await this.musicService.createMusic(createMusicDto, user.userId);
    }

    @Get()
    async getMusics(@GetUser() user: AuthUser, @Query("status") status: MusicStatus, @Query("instrumentId") instrumentId: string) {
        return await this.musicService.getMusicsByUser(user.userId, { status, instrumentId });
    }

    @Get(':id')
    async getMusicById(@Param('id') id: string) {
        return await this.musicService.getMusicById(id)
    }

    @Patch(':id')
    async updateMusic(
        @Param('id') id: string,
        @Body() updateMusicDto: UpdateMusicDto,
        @GetUser() user: AuthUser,
    ) {
        return await this.musicService.updateMusic(id, user.userId, updateMusicDto);
    }

    @Delete(':id')
    async deleteMusic(@Param('id') id: string, @GetUser() user: AuthUser) {
        return await this.musicService.deleteMusic(id, user.userId);
    }
}
