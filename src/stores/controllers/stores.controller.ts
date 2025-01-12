import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StoresService } from '../services/stores.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { Store } from '../interfaces/store.interface';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  async findAll(): Promise<Store[]> {
    return this.storesService.findAll();
  }

  @Get('cep/:cep')
  async findByCep(@Param('cep') cep: string): Promise<Store[]> {
    return this.storesService.findByCep(cep);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Store> {
    return this.storesService.findById(id);
  }

  @Get('state/:state')
  async findByState(@Param('state') state: string): Promise<Store[]> {
    return this.storesService.findByState(state);
  }
}