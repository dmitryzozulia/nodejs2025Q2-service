import { FavoritesService } from './favorites.service';
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Response } from 'express';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TrackService } from '../track/track.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private favsService: FavoritesService,
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private trackService: TrackService,
  ) {}

  @Get()
  getAll(@Res() res: Response) {
    return res.status(HttpStatus.OK).json(this.favsService.getAll());
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid trackid' });
    }
    const track = this.trackService.findById(id);
    if (!track) {
      return res.status(422).json({ message: 'Track not found' });
    }
    this.favsService.addTrack(id);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Track added to favorites' });
  }

  @Delete('track/:id')
  removeTrack(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id))
      return res.status(400).json({ message: 'Invalid trackId' });
    if (!this.favsService.isTrackFavorite(id))
      return res.status(404).json({ message: 'Track not found.' });
    this.favsService.removeTrack(id);
    return res.status(204).send();
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid artistId' });
    }
    const artist = this.artistsService.findById(id);
    if (!artist) {
      return res.status(422).json({ message: 'Artist not found' });
    }
    this.favsService.addArtist(id);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Artist added to favorites' });
  }

  @Delete('artist/:id')
  removeArtist(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id))
      return res.status(400).json({ message: 'Invalid artistId' });
    if (!this.favsService.isArtistFavorite(id))
      return res.status(404).json({ message: 'Artist not found.' });
    this.favsService.removeArtist(id);
    return res.status(204).send();
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid albumId' });
    }
    const album = this.albumsService.findById(id);
    if (!album) {
      return res.status(422).json({ message: 'Album not found' });
    }
    this.favsService.addAlbum(id);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Album added to favorites' });
  }

  @Delete('album/:id')
  removeAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id))
      return res.status(400).json({ message: 'Invalid albumId' });
    if (!this.favsService.isAlbumFavorite(id))
      return res.status(404).json({ message: 'Album not found.' });
    this.favsService.removeAlbum(id);
    return res.status(204).send();
  }
}
