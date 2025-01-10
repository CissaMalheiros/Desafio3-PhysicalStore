import { Injectable, Logger } from '@nestjs/common';

interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable()
export class CepService {
  private readonly logger = new Logger(CepService.name);

  async getAddressByCep(cep: string): Promise<Address> {
    this.logger.log(`Buscando endereço para o CEP: ${cep}`);
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      this.logger.error(`Erro ao buscar endereço para o CEP: ${cep}`);
      throw new Error('Erro ao buscar endereço');
    }
    const data = await response.json() as Address;
    if (data.erro) {
      this.logger.error(`CEP não encontrado: ${cep}`);
      throw new Error('CEP não encontrado');
    }
    this.logger.log('Endereço buscado com sucesso');
    return data;
  }
}