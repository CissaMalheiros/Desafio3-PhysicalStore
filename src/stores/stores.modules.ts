import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schemas/store.schema';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}