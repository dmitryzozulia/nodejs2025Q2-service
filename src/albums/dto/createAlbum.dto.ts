import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Album {
  @IsString({ message: 'name is not string' })
  @IsNotEmpty({ message: 'name is empty string' })
  name: string;
  @IsNumber({}, { message: 'duration should be number value' })
  year: number;

  artistId: string | null;
}
