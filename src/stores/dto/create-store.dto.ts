import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Loja Teste' })
  readonly storeName: string;

  @ApiProperty({ example: true })
  readonly takeOutInStore: boolean;

  @ApiProperty({ example: 'LOJA' })
  readonly type: string; // PDV | LOJA

  @ApiProperty({ example: '123' })
  readonly address3: string; // número da loja

  @ApiProperty({ example: '01001-000' })
  readonly postalCode: string;

  @ApiProperty({ example: '99 12345678' })
  readonly telephoneNumber: string;

  @ApiProperty({ example: 'emailteste@gmail.com' })
  readonly emailAddress: string;
}