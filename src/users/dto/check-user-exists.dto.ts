import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CheckUserExistsDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;
}
