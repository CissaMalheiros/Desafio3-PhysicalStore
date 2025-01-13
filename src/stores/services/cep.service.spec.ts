import { Test, TestingModule } from '@nestjs/testing';
import { CepService } from './cep.service';
import axios from 'axios';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CepService', () => {
  let service: CepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CepService],
    }).compile();

    service = module.get<CepService>(CepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAddressByCep', () => {
    it('should return address for valid CEP', async () => {
      const cep = '01001000';
      const address = {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        complemento: '',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107',
      };

      mockedAxios.get.mockResolvedValue({ status: 200, data: address });

      const result = await service.getAddressByCep(cep);
      expect(result).toEqual(address);
    });

    it('should throw BadRequestException for invalid CEP', async () => {
      const cep = 'invalid';

      await expect(service.getAddressByCep(cep)).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for API error', async () => {
      const cep = '01001000';

      mockedAxios.get.mockRejectedValue({ response: { status: 500 } });

      await expect(service.getAddressByCep(cep)).rejects.toThrow(InternalServerErrorException);
    });
  });
});