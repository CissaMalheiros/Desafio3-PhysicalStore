import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosService } from './correios.service';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { productConfig } from '../../config/product.config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CorreiosService', () => {
  let service: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorreiosService],
    }).compile();

    service = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFreightPrice', () => {
    it('should return freight price for valid request', async () => {
      const cepOrigem = '01001000';
      const cepDestino = '02020000';
      const freightPrice = { price: 'R$ 15,00', prazo: '2 dias úteis' };

      mockedAxios.get.mockResolvedValue({ status: 200, data: freightPrice });

      const result = await service.getFreightPrice(cepOrigem, cepDestino);
      expect(result).toEqual(freightPrice);
    });

    it('should throw an error for API error', async () => {
      const cepOrigem = '01001000';
      const cepDestino = '02020000';

      mockedAxios.get.mockRejectedValue({ response: { status: 500 } });

      await expect(service.getFreightPrice(cepOrigem, cepDestino)).rejects.toThrow('Erro ao buscar preço do frete');
    });
  });
});