import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseCleanerService } from './database-cleaner.service';
import { DatabaseController } from './database.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  providers: [DatabaseCleanerService],
  controllers: [DatabaseController],
  exports: [DatabaseCleanerService],
})
export class DatabaseModule {}