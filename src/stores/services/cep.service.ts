import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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

  private isValidCep(cep: string): boolean {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
    return cepRegex.test(cep);
  }

  async getAddressByCep(cep: string): Promise<Address> {
    this.logger.log(`Buscando endereço para o CEP: ${cep}`);

    if (!this.isValidCep(cep)) {
      this.logger.error(`CEP inválido: ${cep}`);
      throw new BadRequestException(`CEP inválido: ${cep}`);
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      this.logger.log(`Resposta da API ViaCEP: ${JSON.stringify(response.data)}`);
      if (response.status !== 200) {
        this.logger.error(`Erro ao buscar endereço para o CEP: ${cep}`);
        throw new InternalServerErrorException(`Erro ao buscar endereço para o CEP: ${cep}`);
      }
      const data = response.data as Address;
      if (data.erro) {
        this.logger.error(`CEP não encontrado: ${cep}`);
        throw new BadRequestException(`CEP não encontrado: ${cep}`);
      }
      this.logger.log('Endereço buscado com sucesso');
      return data;
    } catch (error) {
      this.logger.error(`Erro ao buscar endereço para o CEP: ${cep}`, (error as any).stack);
      if ((error as any).response && (error as any).response.status === 404) {
        throw new BadRequestException(`CEP não encontrado: ${cep}`);
      }
      throw new InternalServerErrorException(`Erro ao buscar endereço para o CEP: ${cep}`);
    }
  }
}