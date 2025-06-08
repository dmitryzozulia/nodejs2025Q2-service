import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Body,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Response } from 'express';
import { isUUID } from 'class-validator';
import { Album } from './dto/createAlbum.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getArtists() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid Id' });
    }
    const album = this.albumsService.findById(id);
    if (!album) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Album not found' });
    }
    return res.status(HttpStatus.OK).json(album);
  }

  @Post()
  createTrack(@Body() body: Album, @Res() res: Response) {
    const { name, year, artistId } = body;
    const artist = this.albumsService.createAlbum(name, year, artistId);
    return res.status(HttpStatus.CREATED).json(artist);
  }

  @Put(':id')
  updateAlbum(
    @Param('id') id: string,
    @Body() body: Album,
    @Res() res: Response,
  ) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid artistId' });
    }
    const { name, year, artistId } = body;
    const updatedAlbum = this.albumsService.updateAlbum(
      id,
      name,
      year,
      artistId,
    );
    if (!updatedAlbum) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Artist not found' });
    }
    return res.status(HttpStatus.OK).json(updatedAlbum);
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid albumId' });
    }
    const deleted = this.albumsService.deleteAlbum(id);
    if (!deleted) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Album not found' });
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
