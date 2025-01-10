import fetch from 'node-fetch';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CepService {
  private readonly logger = new Logger(CepService.name);

  async getAddressByCep(cep: string): Promise<any> {
    this.logger.log(`Buscando endereço para o CEP: ${cep}`);
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      this.logger.error(`Erro ao buscar endereço para o CEP: ${cep}`);
      throw new Error('Erro ao buscar endereço');
    }
    const data = await response.json();
    if (data.erro) {
      this.logger.error(`CEP não encontrado: ${cep}`);
      throw new Error('CEP não encontrado');
    }
    this.logger.log('Endereço buscado com sucesso');
    return data;
  }
}