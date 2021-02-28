// Dependencies
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Question } from './Question';
import { User } from './User';

export class Answer {
  @prop({ required: true })
  answer!: string;

  @prop({ required: true })
  user!: Ref<User>;

  @prop({ required: true })
  question!: Ref<Question>;
}

// Get Question model
export const AnswerModel = getModelForClass(Answer, {
  schemaOptions: { timestamps: true },
});
