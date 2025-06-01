import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString({ message: 'name is not string' })
  @IsNotEmpty({ message: 'name is empty string' })
  name: string;

  artistId: string | null;
  albumId: string | null;

  @IsNumber({}, { message: 'duration should be number value' })
  duration: number;
}
