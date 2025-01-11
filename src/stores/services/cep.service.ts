import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

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
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.status !== 200) {
      this.logger.error(`Erro ao buscar endereço para o CEP: ${cep}`);
      throw new Error('Erro ao buscar endereço');
    }
    const data = response.data as Address;
    if (data.erro) {
      this.logger.error(`CEP não encontrado: ${cep}`);
      throw new Error('CEP não encontrado');
    }
    this.logger.log('Endereço buscado com sucesso');
    return data;
  }
}