import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store } from '../interfaces/store.interface';
import { CreateStoreDto } from '../dto/create-store.dto';
import { CepService } from './cep.service';
import { GeocodingService } from './geocoding.service';
import { CorreiosService } from './correios.service';
import { calculateDistance } from '../../common/utils/distance.utils';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel('Store') private readonly storeModel: Model<Store>,
    private readonly cepService: CepService,
    private readonly geocodingService: GeocodingService,
    private readonly correiosService: CorreiosService,
  ) { }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const createdStore = new this.storeModel(createStoreDto);
    return createdStore.save();
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findByCep(cep: string): Promise<any> {
    const address = await this.cepService.getAddressByCep(cep);
    const coordinates = await this.geocodingService.getCoordinates(`${address.logradouro}, ${address.localidade}, ${address.uf}`);
    const stores = await this.storeModel.find().exec();
    const nearbyStores = [];

    for (const store of stores) {
      const distance = calculateDistance(coordinates.lat, coordinates.lng, parseFloat(store.latitude), parseFloat(store.longitude));
      if (distance <= 50) {
        nearbyStores.push({
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance: `${distance.toFixed(1)} km`,
          value: [
            {
              prazo: `${store.shippingTimeInDays} dias úteis`,
              price: 'R$ 15,00',
              description: 'Motoboy',
            },
          ],
        });
      } else {
        const freightPrice = await this.correiosService.getFreightPrice(store.postalCode, cep, 1, 20, 20, 20);
        nearbyStores.push({
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance: `${distance.toFixed(1)} km`,
          value: freightPrice,
        });
      }
    }

    return {
      stores: nearbyStores,
      limit: 1,
      offset: 1,
      total: nearbyStores.length,
    };
  }

  async findById(id: string): Promise<Store> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.storeModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByState(state: string): Promise<Store[]> {
    return this.storeModel.find({ state }).exec();
  }
}