import { Module, forwardRef } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TrackModule } from '../track/track.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  imports: [forwardRef(() => TrackModule)],
})
export class ArtistsModule {}
