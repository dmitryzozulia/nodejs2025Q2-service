import { Controller } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import {
  Get,
  Param,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Response } from 'express';
import { Artist } from './dto/artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}
  @Get()
  getArtists() {
    return this.artistsService.findAll();
  }
  @Get(':id')
  getTrackById(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid Id' });
    }
    const track = this.artistsService.findById(id);
    if (!track) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Artist not found' });
    }
    return res.status(HttpStatus.OK).json(track);
  }

  @Post()
  createTrack(@Body() body: Artist, @Res() res: Response) {
    const { name, grammy } = body;
    const artist = this.artistsService.createArtist(name, grammy);
    return res.status(HttpStatus.CREATED).json(artist);
  }

  @Put(':id')
  updateArtist(
    @Param('id') id: string,
    @Body() body: Artist,
    @Res() res: Response,
  ) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid artistId' });
    }
    const { name, grammy } = body;
    const updatedArtist = this.artistsService.updateArtist(id, name, grammy);
    if (!updatedArtist) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Artist not found' });
    }
    return res.status(HttpStatus.OK).json(updatedArtist);
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid artistId' });
    }
    const deleted = this.artistsService.deleteArtist(id);
    if (!deleted) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Artist not found' });
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
