import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      codigo: string;
      nombre: string;
      region: string;
      subregion: string;
      capital: string;
      poblacion: number;
      bandera: string;
    },
  ) {
    return this.countriesService.create(body);
  }

  @Get(':codigo')
  findOne(@Param('codigo') codigo: string) {
    return this.countriesService.findOne(codigo);
  }
}
