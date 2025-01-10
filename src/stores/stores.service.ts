// filepath: src/stores/stores.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './interfaces/store.interface';
import { CreateStoreDto } from './dto/create-store.dto';
import { CepService } from './services/cep.service';
import { GeocodingService } from './services/geocoding.service';
import { calculateDistance } from './utils/distance.utils';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel('Store') private readonly storeModel: Model<Store>,
    private readonly cepService: CepService,
    private readonly geocodingService: GeocodingService,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const createdStore = new this.storeModel(createStoreDto);
    return createdStore.save();
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findByCep(cep: string): Promise<Store[]> {
    const address = await this.cepService.getAddressByCep(cep);
    const coordinates = await this.geocodingService.getCoordinates(`${address.logradouro}, ${address.localidade}, ${address.uf}`);
    const stores = await this.storeModel.find().exec();
    const nearbyStores = stores.filter(store => {
      const distance = calculateDistance(coordinates.lat, coordinates.lng, parseFloat(store.latitude), parseFloat(store.longitude));
      return distance <= 50;
    });
    return nearbyStores;
  }

  async findById(id: string): Promise<Store> {
    return this.storeModel.findById(id).exec();
  }

  async findByState(state: string): Promise<Store[]> {
    return this.storeModel.find({ state }).exec();
  }
}