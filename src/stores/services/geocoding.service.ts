import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GeocodingResponse {
  status: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly googleApiKey: string;

  constructor(private configService: ConfigService) {
    this.googleApiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!this.googleApiKey) {
      throw new Error('Google API key is not defined');
    }
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    this.logger.log(`Buscando coordenadas para o endereço: ${address}`);
    const fetch = (await import('node-fetch')).default;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.googleApiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      this.logger.error(`Erro ao buscar coordenadas para o endereço: ${address}`);
      throw new Error('Erro ao buscar coordenadas');
    }
    const data = await response.json() as GeocodingResponse;
    if (data.status !== 'OK') {
      this.logger.error(`Erro ao buscar coordenadas: ${data.status}`);
      throw new Error('Erro ao buscar coordenadas');
    }
    const location = data.results[0].geometry.location;
    this.logger.log('Coordenadas buscadas com sucesso');
    return { lat: location.lat, lng: location.lng };
  }
}