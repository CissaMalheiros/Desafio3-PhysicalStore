import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsIn, Matches, IsEmail } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Loja Teste' })
  @IsString()
  readonly storeName: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  readonly takeOutInStore: boolean;

  @ApiProperty({ example: 'LOJA' })
  @IsString()
  @IsIn(['PDV', 'LOJA'])
  readonly type: string; // PDV | LOJA

  @ApiProperty({ example: '123' })
  @IsString()
  readonly address3: string; // número da loja

  @ApiProperty({ example: '01001000' })
  @Matches(/^[0-9]{8}$/, { message: 'postalCode must be a valid postal code without hyphen' })
  readonly postalCode: string;

  @ApiProperty({ example: '9912345678' })
  @IsString()
  readonly telephoneNumber: string;

  @ApiProperty({ example: 'emailteste@gmail.com' })
  @IsEmail()
  readonly emailAddress: string;
}