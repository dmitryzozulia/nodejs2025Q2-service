import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';
//import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  artists: Artist[] = [
    {
      id: 'b1a7c2e3-4d5f-4a6b-8c9d-1e2f3a4b5c6d',
      name: 'John Doe',
      grammy: true,
    },
    {
      id: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b',
      name: 'Jane Smith',
      grammy: false,
    },
  ];

  findAll() {
    return this.artists;
  }

  findById(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      return undefined;
    }
    return artist;
  }

  createArtist(name: string, grammy: boolean) {
    const newArtist = {
      id: uuidv4(),
      name,
      grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, name: string, grammy: boolean) {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      return null;
    }
    artist.name = name;
    artist.grammy = grammy;
    return artist;
  }

  deleteArtist(id: string) {
    const index = this.artists.findIndex((track) => track.id === id);
    if (index === -1) {
      return false;
    }
    this.trackService.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    this.artists.splice(index, 1);
    return true;
  }
}
