import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
  IsInt,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The content of the post', required: false })
  readonly content: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  @ApiProperty({ description: 'The URL of the cover image', required: false })
  readonly coverImageUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ description: 'The summary of the post', required: false })
  readonly summary?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the post is a draft',
    required: false,
    default: true,
  })
  readonly isDraft?: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'The ID of the user creating the post' })
  readonly userId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @ApiProperty({
    description: 'The IDs of the categories the post belongs to',
    type: [Number],
    required: false,
  })
  readonly categoryIds?: number[];
}
