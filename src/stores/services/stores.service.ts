import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  private async generateStoreID(): Promise<string> {
    const lastStore = await this.storeModel.findOne().sort({ storeID: -1 }).exec();
    const lastStoreID = lastStore ? parseInt(lastStore.storeID, 10) : 0;
    return (lastStoreID + 1).toString();
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const address = await this.cepService.getAddressByCep(createStoreDto.postalCode);
    const coordinates = await this.geocodingService.getCoordinates(`${address.logradouro}, ${address.localidade}, ${address.uf}`);
    const storeID = await this.generateStoreID();

    const createdStore = new this.storeModel({
      ...createStoreDto,
      storeID,
      latitude: coordinates.lat.toString(),
      longitude: coordinates.lng.toString(),
      address1: address.logradouro,
      address2: address.complemento || 'Complemento não informado',
      city: address.localidade,
      district: address.bairro,
      state: address.uf,
      country: 'Brasil',
    });
    return createdStore.save();
  }

  async findAll(): Promise<Store[]> {
    try {
      return await this.storeModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar todas as lojas');
    }
  }

  async findByCep(cep: string): Promise<any> {
    try {
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
          const freightPrice = await this.correiosService.getFreightPrice(store.postalCode, cep);
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
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar lojas por CEP');
    }
  }

  async findById(storeID: string): Promise<Store> {
    try {
      const store = await this.storeModel.findOne({ storeID }).exec();
      if (!store) {
        throw new BadRequestException('Store not found');
      }
      return store;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar loja por ID');
    }
  }

  async findByState(state: string): Promise<Store[]> {
    try {
      return await this.storeModel.find({ state }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar lojas por estado');
    }
  }

  async deleteById(storeID: string): Promise<{ message: string }> {
    try {
      const store = await this.storeModel.findOneAndDelete({ storeID }).exec();
      if (!store) {
        throw new BadRequestException('Store not found');
      }
      return { message: 'Store deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar loja por ID');
    }
  }
}