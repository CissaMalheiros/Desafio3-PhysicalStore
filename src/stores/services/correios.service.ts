import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { productConfig } from '../../config/product.config';

@Injectable()
export class CorreiosService {
  private readonly logger = new Logger(CorreiosService.name);

  async getFreightPrice(cepOrigem: string, cepDestino: string): Promise<any> {
    this.logger.log(`Buscando preço do frete de ${cepOrigem} para ${cepDestino}`);
    const { peso, comprimento, altura, largura } = productConfig;
    const url = `https://www.correios.com.br/@@precosEPrazosView?cepOrigem=${cepOrigem}&cepDestino=${cepDestino}&peso=${peso}&comprimento=${comprimento}&altura=${altura}&largura=${largura}&diametro=0&formato=1&maoPropria=N&valorDeclarado=0&avisoRecebimento=N&servico=04014,04510`;
    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        this.logger.error(`Erro ao buscar preço do frete de ${cepOrigem} para ${cepDestino}`);
        throw new Error('Erro ao buscar preço do frete');
      }
      const data = response.data;
      this.logger.log('Preço do frete buscado com sucesso');
      return data;
    } catch (error) {
      this.logger.error(`Erro ao buscar preço do frete de ${cepOrigem} para ${cepDestino}`, (error as Error).stack);
      throw new Error('Erro ao buscar preço do frete');
    }
  }
}