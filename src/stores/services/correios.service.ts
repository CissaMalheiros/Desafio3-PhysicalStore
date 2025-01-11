import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CorreiosService {
  private readonly logger = new Logger(CorreiosService.name);

  async getFreightPrice(cepOrigem: string, cepDestino: string, peso: number, comprimento: number, altura: number, largura: number): Promise<any> {
    this.logger.log(`Buscando preço do frete de ${cepOrigem} para ${cepDestino}`);
    const url = `https://www.correios.com.br/@@precosEPrazosView?cepOrigem=${cepOrigem}&cepDestino=${cepDestino}&peso=${peso}&comprimento=${comprimento}&altura=${altura}&largura=${largura}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      this.logger.error(`Erro ao buscar preço do frete de ${cepOrigem} para ${cepDestino}`);
      throw new Error('Erro ao buscar preço do frete');
    }
    const data = response.data;
    this.logger.log('Preço do frete buscado com sucesso');
    return data;
  }
}