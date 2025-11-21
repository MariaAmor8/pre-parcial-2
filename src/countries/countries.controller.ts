import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}
  @Get()
  findAll(@Query('region') region?: string) {
    return this.countriesService.findAll({ region });
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

  //Eliminar un pais por codigo
  @UseGuards(AuthGuard)
  @Delete(':codigo')
  delete(@Param('codigo') codigo: string) {
    return this.countriesService.deleteCountry(codigo);
  }
}
