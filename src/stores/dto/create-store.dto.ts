import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsIn, IsPostalCode, IsPhoneNumber, IsEmail } from 'class-validator';

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

  @ApiProperty({ example: '01001-000' })
  @IsPostalCode('BR')
  readonly postalCode: string;

  @ApiProperty({ example: '99 12345678' })
  @IsPhoneNumber('BR')
  readonly telephoneNumber: string;

  @ApiProperty({ example: 'emailteste@gmail.com' })
  @IsEmail()
  readonly emailAddress: string;
}