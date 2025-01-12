import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StoreSchema } from './schemas/store.schema';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/stores.controller';
import { CepService } from './services/cep.service';
import { GeocodingService } from './services/geocoding.service';
import { CorreiosService } from './services/correios.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    ConfigModule,
  ],
  controllers: [StoresController],
  providers: [StoresService, CepService, GeocodingService, CorreiosService],
})
export class StoresModule {}