import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { StoresService } from '../services/stores.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { Store } from '../interfaces/store.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'The store has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({ status: 200, description: 'Return all stores.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  async findAll(): Promise<Store[]> {
    return this.storesService.findAll();
  }

  @Get('cep/:cep')
  @ApiOperation({ summary: 'Get stores by CEP' })
  @ApiResponse({ status: 200, description: 'Return stores by CEP.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  async findByCep(@Param('cep') cep: string): Promise<any> {
    return this.storesService.findByCep(cep);
  }

  @Get(':storeID')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Return store by ID.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  async findById(@Param('storeID') storeID: string): Promise<Store> {
    return this.storesService.findById(storeID);
  }

  @Get('state/:state')
  @ApiOperation({ summary: 'Get stores by state' })
  @ApiResponse({ status: 200, description: 'Return stores by state.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  async findByState(@Param('state') state: string): Promise<Store[]> {
    return this.storesService.findByState(state);
  }

  @Delete(':storeID')
  @ApiOperation({ summary: 'Delete store by ID' })
  @ApiResponse({ status: 200, description: 'The store has been successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Store not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  async deleteById(@Param('storeID') storeID: string): Promise<{ message: string }> {
    return this.storesService.deleteById(storeID);
  }
}