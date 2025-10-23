import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
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
}
