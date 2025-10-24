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

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly content: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  readonly coverImageUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  readonly summary?: string;

  @IsBoolean()
  @IsOptional()
  readonly isDraft?: boolean;

  @IsNotEmpty()
  @IsInt()
  readonly userId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  readonly categoryIds?: number[];
}
