import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  favoriteArtistIds: string[] = [];
  favoriteAlbumIds: string[] = [];
  favoriteTrackIds: string[] = [];

  getAll() {
    return {
      artists: this.favoriteArtistIds
        .map((id) => this.artistsService.findById(id))
        .filter(Boolean),
      albums: this.favoriteAlbumIds
        .map((id) => this.albumsService.findById(id))
        .filter(Boolean),
      tracks: this.favoriteTrackIds
        .map((id) => this.trackService.findById(id))
        .filter(Boolean),
    };
  }

  addTrack(id: string) {
    if (!this.favoriteTrackIds.includes(id)) this.favoriteTrackIds.push(id);
  }
  isTrackFavorite(id: string) {
    return this.favoriteTrackIds.includes(id);
  }
  removeTrack(id: string) {
    const index = this.favoriteTrackIds.indexOf(id);
    this.favoriteTrackIds.splice(index, 1);
  }

  addArtist(id: string) {
    if (!this.favoriteArtistIds.includes(id)) this.favoriteArtistIds.push(id);
  }
  isArtistFavorite(id: string) {
    return this.favoriteArtistIds.includes(id);
  }
  removeArtist(id: string) {
    const index = this.favoriteArtistIds.indexOf(id);
    this.favoriteArtistIds.splice(index, 1);
  }

  addAlbum(id: string) {
    if (!this.favoriteAlbumIds.includes(id)) this.favoriteAlbumIds.push(id);
  }
  isAlbumFavorite(id: string) {
    return this.favoriteAlbumIds.includes(id);
  }
  removeAlbum(id: string) {
    const index = this.favoriteAlbumIds.indexOf(id);
    this.favoriteAlbumIds.splice(index, 1);
  }
}
