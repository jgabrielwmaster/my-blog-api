import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly avatar: string;
}

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

export class UpdateUserDto extends PartialType(CreateUserDto) {}
