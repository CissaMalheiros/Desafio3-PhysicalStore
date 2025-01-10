import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './interfaces/store.interface';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(@InjectModel('Store') private readonly storeModel: Model<Store>) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const createdStore = new this.storeModel(createStoreDto);
    return createdStore.save();
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findByCep(cep: string): Promise<Store[]> {
    // Implementar lógica para buscar lojas próximas ao CEP
  }

  async findById(id: string): Promise<Store> {
    return this.storeModel.findById(id).exec();
  }

  async findByState(state: string): Promise<Store[]> {
    return this.storeModel.find({ state }).exec();
  }
}