// Dependencies
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { Question } from './Question';
import { User } from './User';

export class Answer {
  @prop({ required: true })
  answer!: string;

  @prop({ required: true, type: Schema.Types.ObjectId })
  user!: Ref<User>;

  @prop({ required: true, type: Schema.Types.ObjectId })
  question!: Ref<Question>;
}

// Get Question model
export const AnswerModel = getModelForClass(Answer, {
  schemaOptions: { timestamps: true },
});
