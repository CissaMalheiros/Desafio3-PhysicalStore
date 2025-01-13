import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { StoresService } from '../services/stores.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { Store } from '../interfaces/store.interface';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  async findAll(): Promise<Store[]> {
    return this.storesService.findAll();
  }

  @Get('cep/:cep')
  async findByCep(@Param('cep') cep: string): Promise<any> {
    return this.storesService.findByCep(cep);
  }

  @Get(':storeID')
  async findById(@Param('storeID') storeID: string): Promise<Store> {
    return this.storesService.findById(storeID);
  }

  @Get('state/:state')
  async findByState(@Param('state') state: string): Promise<Store[]> {
    return this.storesService.findByState(state);
  }

  @Delete(':storeID')
  async deleteById(@Param('storeID') storeID: string): Promise<{ message: string }> {
    return this.storesService.deleteById(storeID);
  }
}