import { IsString } from 'class-validator';

export class SearchRequestDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
