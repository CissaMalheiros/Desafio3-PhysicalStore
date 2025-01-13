import { Test, TestingModule } from '@nestjs/testing';
import { GeocodingService } from './geocoding.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Logger } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GeocodingService', () => {
  let service: GeocodingService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeocodingService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-google-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<GeocodingService>(GeocodingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoordinates', () => {
    it('should return coordinates for valid address', async () => {
      const address = 'Praça da Sé, São Paulo, SP';
      const coordinates = { lat: -23.55052, lng: -46.633308 };

      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {
          status: 'OK',
          results: [
            {
              geometry: {
                location: coordinates,
              },
            },
          ],
        },
      });

      const result = await service.getCoordinates(address);
      expect(result).toEqual(coordinates);
    });

    it('should throw an error for invalid address', async () => {
      const address = 'invalid address';

      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {
          status: 'ZERO_RESULTS',
          results: [],
        },
      });

      await expect(service.getCoordinates(address)).rejects.toThrow('Erro ao buscar coordenadas');
    });

    it('should throw an error for API error', async () => {
      const address = 'Praça da Sé, São Paulo, SP';

      mockedAxios.get.mockRejectedValue(new Error('Erro ao buscar coordenadas'));

      await expect(service.getCoordinates(address)).rejects.toThrow('Erro ao buscar coordenadas');
    });
  });
});