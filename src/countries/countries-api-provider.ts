import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RestCountriesApiResponse } from './schemas/countryapi';

@Injectable()
export class CountriesApiProvider {
  constructor(private readonly httpService: HttpService) {}

  async fetchCountryFromApi(
    code: string,
  ): Promise<RestCountriesApiResponse | null> {
    // buscar país por codigo alpha3 de la API REST Countries
    const url =
      `https://restcountries.com/v3.1/alpha/${code}` +
      `?fields=cca3,name,region,subregion,capital,population,flags`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RestCountriesApiResponse>(url),
      );
      const data = response.data;
      if (data === undefined || data === null) {
        return null;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching country from API:', error);
      return null;
    }
  }
}
