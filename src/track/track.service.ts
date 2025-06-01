import { Injectable } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  tracks: Track[] = [
    {
      id: 'c9b1c1e2-2f4a-4e7e-9b2e-7f6e8e2e2e2e',
      name: 'Track One',
      artistId: 'a1b2c3d4-e5f6-4890-abcd-ef1234567890',
      albumId: '22222222-2222-4222-8222-222222222222',
      duration: 210,
    },
    {
      id: 'b7e23e04-5c8e-4b1e-9e7e-2e2e2e2e2e2e',
      name: 'Track Two',
      artistId: null,
      albumId: '22222222-2222-4222-8222-222222222222',
      duration: 180,
    },
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      name: 'Track Three',
      artistId: 'b2c3d4e5-f6a7-4901-bcde-fa2345678901',
      albumId: null,
      duration: 240,
    },
    {
      id: 'e4eaaaf2-d142-11e1-b3e4-080027620cdd',
      name: 'Track Four',
      artistId: 'a1b2c3d4-e5f6-4890-abcd-ef1234567890',
      albumId: null,
      duration: 200,
    },
    {
      id: '16fd2706-8baf-433b-82eb-8c7fada847da',
      name: 'Track Five',
      artistId: null,
      albumId: '22222222-2222-4222-8222-222222222222',
      duration: 150,
    },
  ];

  findAll() {
    return this.tracks;
  }
  findById(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      return undefined;
    }
    return track;
  }

  createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ) {
    const newTrack = {
      id: uuidv4(),
      name,
      artistId: artistId ? artistId : null,
      albumId: albumId ? albumId : null,
      duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  updateTrack(
    id: string,
    data: {
      name: string | null;
      artistId: string | null;
      albumId: string | null;
      duration: number | null;
    },
  ) {
    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      return null;
    }
    track.name = data.name ? data.name : track.name;
    track.artistId = data.artistId ? data.artistId : track.artistId;
    track.albumId = data.albumId ? data.albumId : track.albumId;
    track.duration = data.duration ? data.duration : track.duration;
    return track;
  }

  deleteTrack(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      return false;
    }
    this.tracks.splice(index, 1);
    return true;
  }
}
