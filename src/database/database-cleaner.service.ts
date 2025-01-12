import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseCleanerService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async cleanDatabase(): Promise<void> {
    await this.connection.dropDatabase();
  }
}