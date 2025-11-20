import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { Model } from 'mongoose';
import { CountriesApiProvider } from './countries-api-provider';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    private readonly countriesApiProvider: CountriesApiProvider,
  ) {}

  create(body: {
    codigo: string;
    nombre: string;
    region: string;
    subregion: string;
    capital: string;
    poblacion: number;
    bandera: string;
  }) {
    if (
      !body.codigo ||
      !body.nombre ||
      !body.region ||
      !body.subregion ||
      !body.capital ||
      !body.poblacion ||
      !body.bandera
    ) {
      throw new Error('Faltan datos obligatorios');
    }
    return this.countryModel.create({
      codigo: body.codigo.trim(),
      nombre: body.nombre.trim(),
      region: body.region.trim(),
      subregion: body.subregion.trim(),
      capital: body.capital.trim(),
      poblacion: body.poblacion,
      bandera: body.bandera.trim(),
      fuente: 'REST Countries API',
    });
  }

  findAll() {
    return this.countryModel.find().exec();
  }
  // encontrar país por código, con caché en BD y llamada a API externa si no está
  // con codigo alpha3
  async findOne(codigo: string): Promise<CountryDocument> {
    const trimmedCode = codigo.trim().toUpperCase();

    // Buscar en la BD local (caché)
    const countryFromDb = await this.countryModel
      .findOne({ codigo: trimmedCode })
      .exec();

    if (countryFromDb) {
      // Actualizar la fuente a 'cache' y persistir
      countryFromDb.fuente = 'cache';
      await countryFromDb.save();
      return countryFromDb; // hit de caché
    }

    // llamar a la API externa
    const apiCountry =
      await this.countriesApiProvider.fetchCountryFromApi(trimmedCode);

    if (apiCountry === null) {
      throw new NotFoundException(
        `País con código ${trimmedCode} no encontrado`,
      );
    }

    // Mapear respuesta de la API a documento Country
    const nuevoCountry = new this.countryModel({
      codigo: apiCountry.cca3 ?? trimmedCode,
      nombre: apiCountry.name?.common,
      region: apiCountry.region,
      subregion: apiCountry.subregion,
      capital: apiCountry.capital?.[0] ?? '',
      poblacion: apiCountry.population,
      bandera: apiCountry.flags?.png ?? apiCountry.flags?.svg ?? '',
      fuente: 'REST Countries API',
    });

    // Guardar en la BD (poblar la caché) y devolver
    const saved = await nuevoCountry.save();
    return saved;
  }
}
