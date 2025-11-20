import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CountryDocument = HydratedDocument<Country>;
@Schema({ timestamps: true }) //agrega createdAt y updatedAt
export class Country {
  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  subregion: string;

  @Prop({ required: true })
  capital: string;

  @Prop({ required: true })
  poblacion: number;

  @Prop({ required: true })
  bandera: string;

  @Prop({ required: true, default: 'cache' })
  fuente: string;
}
export const CountrySchema = SchemaFactory.createForClass(Country);
