import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [StoresModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}