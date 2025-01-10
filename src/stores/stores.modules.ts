import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schemas/store.schema';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { CepService } from './services/cep.service';
import { GeocodingService } from './services/geocoding.service';
import { CorreiosService } from './services/correios.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }])],
  controllers: [StoresController],
  providers: [StoresService, CepService, GeocodingService, CorreiosService],
})
export class StoresModule {}