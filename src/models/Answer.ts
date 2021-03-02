// Dependencies
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Schema, Types } from 'mongoose';
import { Question } from './Question';
import { User } from './User';

export class Answer {
  _id: Types.ObjectId;

  @prop({ required: true })
  answer!: string;

  @prop({ required: true, type: Schema.Types.ObjectId })
  user!: Ref<User>;

  @prop({ required: true, type: Schema.Types.ObjectId })
  question!: Ref<Question>;
}

// Get Answer model
export const AnswerModel = getModelForClass(Answer, {
  schemaOptions: { timestamps: true },
});
