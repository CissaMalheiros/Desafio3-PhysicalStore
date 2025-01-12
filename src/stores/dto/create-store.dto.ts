export class CreateStoreDto {
  readonly storeName: string;
  readonly takeOutInStore: boolean;
  readonly shippingTimeInDays: number;
  readonly type: string; // PDV | LOJA
  readonly address3: string; // número da loja
  readonly postalCode: string;
  readonly telephoneNumber: string;
  readonly emailAddress: string;
}