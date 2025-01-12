import { Module } from '@nestjs/common';
import { StoresModule } from './stores/stores.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [StoresModule, DatabaseModule],
})
export class AppModule { }