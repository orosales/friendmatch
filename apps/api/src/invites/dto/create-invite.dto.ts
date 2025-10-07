import { IsString, IsArray, IsDateString, IsInt, IsOptional, IsEnum } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  ownerId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @IsDateString()
  startTime: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsInt()
  radiusKm: number;

  @IsEnum(['public', 'friends', 'private'])
  visibility: string;

  @IsString()
  @IsOptional()
  venueId?: string;

  @IsInt()
  @IsOptional()
  maxAttendees?: number;
}
