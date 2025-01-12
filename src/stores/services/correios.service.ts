import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CorreiosService {
  private readonly logger = new Logger(CorreiosService.name);

  async getFreightPrice(cepOrigem: string, cepDestino: string, peso: number, comprimento: number, altura: number, largura: number): Promise<any> {
    this.logger.log(`Buscando preço do frete de ${cepOrigem} para ${cepDestino}`);
    const url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?sCepOrigem=${cepOrigem}&sCepDestino=${cepDestino}&nVlPeso=${peso}&nCdFormato=1&nVlComprimento=${comprimento}&nVlAltura=${altura}&nVlLargura=${largura}&nVlDiametro=0&nCdServico=04014,04510&nCdEmpresa=&sDsSenha=&sCdMaoPropria=N&nVlValorDeclarado=0&sCdAvisoRecebimento=N&StrRetorno=xml`;
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