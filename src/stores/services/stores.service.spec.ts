import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { getModelToken } from '@nestjs/mongoose';
import { Store } from '../interfaces/store.interface';
import { Model } from 'mongoose';
import { CepService } from './cep.service';
import { GeocodingService } from './geocoding.service';
import { CorreiosService } from './correios.service';
import { CreateStoreDto } from '../dto/create-store.dto';

const mockStoreModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
  create: jest.fn(),
  exec: jest.fn(),
  save: jest.fn(),
};

const mockCepService = {
  getAddressByCep: jest.fn(),
};

const mockGeocodingService = {
  getCoordinates: jest.fn(),
};

const mockCorreiosService = {
  getFreightPrice: jest.fn(),
};

describe('StoresService', () => {
  let service: StoresService;
  let model: Model<Store>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        { provide: getModelToken('Store'), useValue: mockStoreModel },
        { provide: CepService, useValue: mockCepService },
        { provide: GeocodingService, useValue: mockGeocodingService },
        { provide: CorreiosService, useValue: mockCorreiosService },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    model = module.get<Model<Store>>(getModelToken('Store'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new store', async () => {
      const createStoreDto: CreateStoreDto = {
        storeName: 'Loja Teste',
        takeOutInStore: true,
        type: 'LOJA',
        address3: '123',
        postalCode: '01001000',
        telephoneNumber: '9912345678',
        emailAddress: 'emailteste@gmail.com',
      };

      const address = {
        cep: '01001000',
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

      const coordinates = { lat: -23.55052, lng: -46.633308 };

      const storeID = '1';

      jest.spyOn(service as any, 'generateStoreID').mockResolvedValue(storeID);
      mockCepService.getAddressByCep.mockResolvedValue(address);
      mockGeocodingService.getCoordinates.mockResolvedValue(coordinates);
      mockStoreModel.create.mockReturnValue({
        ...createStoreDto,
        storeID,
        shippingTimeInDays: 2,
        latitude: coordinates.lat.toString(),
        longitude: coordinates.lng.toString(),
        address1: address.logradouro,
        address2: address.complemento || 'Complemento não informado',
        city: address.localidade,
        district: address.bairro,
        state: address.uf,
        country: 'Brasil',
        save: jest.fn().mockResolvedValue(true),
      });

      const result = await service.create(createStoreDto);
      expect(result).toBeDefined();
      expect(result.storeID).toBe(storeID);
      expect(result.storeName).toBe(createStoreDto.storeName);
    });
  });

  describe('findAll', () => {
    it('should return all stores', async () => {
      const stores = [
        { storeName: 'Loja 1' },
        { storeName: 'Loja 2' },
      ];

      mockStoreModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(stores),
      });

      const result = await service.findAll();
      expect(result).toEqual(stores);
    });
  });

  describe('findByCep', () => {
    it('should return stores by CEP', async () => {
      const cep = '01001000';
      const address = {
        cep: '01001000',
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

      const coordinates = { lat: -23.55052, lng: -46.633308 };

      const stores = [
        {
          storeName: 'Loja 1',
          latitude: '-23.55052',
          longitude: '-46.633308',
          postalCode: '01001000',
          type: 'LOJA',
          shippingTimeInDays: 2,
        },
      ];

      mockCepService.getAddressByCep.mockResolvedValue(address);
      mockGeocodingService.getCoordinates.mockResolvedValue(coordinates);
      mockStoreModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(stores),
      });

      const result = await service.findByCep(cep);
      expect(result).toBeDefined();
      expect(result.stores.length).toBeGreaterThan(0);
    });
  });

  describe('findById', () => {
    it('should return a store by ID', async () => {
      const storeID = '1';
      const store = { storeID, storeName: 'Loja 1' };

      mockStoreModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(store),
      });

      const result = await service.findById(storeID);
      expect(result).toEqual(store);
    });

    it('should throw an error if store not found', async () => {
      const storeID = '1';

      mockStoreModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(storeID)).rejects.toThrow('Erro ao buscar loja por ID');
    });
  });

  describe('findByState', () => {
    it('should return stores by state', async () => {
      const state = 'SP';
      const stores = [
        { storeName: 'Loja 1', state: 'SP' },
        { storeName: 'Loja 2', state: 'SP' },
      ];

      mockStoreModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(stores),
      });

      const result = await service.findByState(state);
      expect(result).toEqual(stores);
    });
  });

  describe('deleteById', () => {
    it('should delete a store by ID', async () => {
      const storeID = '1';
      const store = { storeID, storeName: 'Loja 1' };

      mockStoreModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(store),
      });

      const result = await service.deleteById(storeID);
      expect(result).toEqual({ message: 'Store deleted successfully' });
    });

    it('should throw an error if store not found', async () => {
      const storeID = '1';

      mockStoreModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deleteById(storeID)).rejects.toThrow('Erro ao deletar loja por ID');
    });
  });
});