// Dependencies
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Question } from './Question';
import { QuestionnareAttempt } from './QuestionnareAttempt';
import { User } from './User';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Answer extends Base {}

export class Answer extends TimeStamps {
  @prop({ required: true })
  answer!: string;

  @prop({ required: true, ref: User })
  user!: Ref<User>;

  @prop({ required: true, ref: Question })
  question!: Ref<Question>;

  @prop({ required: true, ref: QuestionnareAttempt })
  attempt!: Ref<QuestionnareAttempt>;
}

// Get Answer model
export const AnswerModel = getModelForClass(Answer, {
  schemaOptions: { timestamps: true },
});
