import { IsBoolean, IsString } from 'class-validator';

export class Artist {
  @IsString({ message: 'name is not string' })
  name: string;
  @IsBoolean({ message: 'grammy is not boolean value' })
  grammy: boolean;
}
