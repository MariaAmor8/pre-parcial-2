import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Country } from '../../countries/schemas/country.schema';
import { Comment, CommentSchema } from './comment.schema';

export type TravelPlanDocument = HydratedDocument<TravelPlan>;
@Schema({ timestamps: true }) // agrega createdAt y updatedAt
export class TravelPlan {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ required: true })
  fechaFin: Date;

  //@Prop({ required: false })
  //comentario: string;

  @Prop({ type: Types.ObjectId, ref: 'Country', required: true })
  pais: Country;

  @Prop({ type: [CommentSchema], default: [] })
  comentarios: Comment[];
}
export const TravelPlanSchema = SchemaFactory.createForClass(TravelPlan);
