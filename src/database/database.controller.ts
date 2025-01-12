import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DatabaseCleanerService } from './database-cleaner.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseCleanerService: DatabaseCleanerService) {}

  @Delete('clean')
  @HttpCode(HttpStatus.OK)
  async cleanDatabase(): Promise<{ message: string }> {
    await this.databaseCleanerService.cleanDatabase();
    return { message: 'Database cleaned successfully' };
  }
}