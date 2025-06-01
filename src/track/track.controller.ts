import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { isUUID } from 'class-validator';
import { Response } from 'express';
import { CreateTrackDto } from './dto/CreateTrack.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}
  @Get()
  getTraks() {
    return this.trackService.findAll();
  }
  @Get(':id')
  getTrackById(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid trackId' });
    }
    const track = this.trackService.findById(id);
    if (!track) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Track not found' });
    }
    return res.status(HttpStatus.OK).json(track);
  }

  @Post()
  createTrack(@Body() body: CreateTrackDto, @Res() res: Response) {
    const { name, artistId, albumId, duration } = body;
    if (!name || typeof duration !== 'number') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'name and duration are required' });
    }
    const user = this.trackService.createTrack(
      name,
      artistId,
      albumId,
      duration,
    );
    return res.status(HttpStatus.CREATED).json(user);
  }

  @Put(':id')
  updateTrack(
    @Param('id') id: string,
    @Body() body: CreateTrackDto,
    @Res() res: Response,
  ) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid trackId' });
    }
    const updatedTrack = this.trackService.updateTrack(id, body);
    if (!updatedTrack) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Track not found' });
    }
    return res.status(HttpStatus.OK).json(updatedTrack);
  }

  @Delete(':id')
  deleteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!isUUID(id)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid TrackId' });
    }
    const deleted = this.trackService.deleteTrack(id);
    if (!deleted) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Track not found' });
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
