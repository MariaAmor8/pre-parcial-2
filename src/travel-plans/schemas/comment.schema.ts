import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;
@Schema({ timestamps: true }) // agrega createdAt y updatedAt
export class Comment {
  @Prop({ required: true })
  descripcion: string;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
