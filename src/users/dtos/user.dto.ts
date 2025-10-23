import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  readonly profile: CreateProfileDto;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['profile'] as const),
) {
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  @IsOptional()
  readonly profile: UpdateProfileDto;
}
