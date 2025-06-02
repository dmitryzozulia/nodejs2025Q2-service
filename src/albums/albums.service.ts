import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { TrackService } from '../track/track.service';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  albums: Album[] = [
    {
      id: 'a3b2c1d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d',
      name: 'First Album',
      year: 2020,
      artistId: 'b1a7c2e3-4d5f-4a6b-8c9d-1e2f3a4b5c6d',
    },
    {
      id: 'b4c3d2e5-f6a7-4b8c-9d0e-2f3a4b5c6d7e',
      name: 'Second Album',
      year: 2022,
      artistId: null,
    },
    {
      id: 'c5d4e3f6-a7b8-4c9d-0e1f-3a4b5c6d7e8f',
      name: 'Third Album',
      year: 2021,
      artistId: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b',
    },
  ];

  findAll() {
    return this.albums;
  }

  findById(id: string) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      return undefined;
    }
    return album;
  }

  createAlbum(name: string, year: number, artistId: string | null): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name,
      year,
      artistId: artistId ?? null,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }
  updateAlbum(id: string, name: string, year: number, artistId: string | null) {
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      return null;
    }
    album.name = name;
    album.year = year;
    album.artistId = artistId ?? null;
    return album;
  }

  deleteAlbum(id: string) {
    const index = this.albums.findIndex((track) => track.id === id);
    if (index === -1) {
      return false;
    }
    this.trackService.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    this.albums.splice(index, 1);
    return true;
  }
}
