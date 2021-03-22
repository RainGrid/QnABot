// Dependencies
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Questionnaire } from './Questionnaire';
import { User } from './User';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QuestionnaireAttempt extends Base {}

export class QuestionnaireAttempt extends TimeStamps {
  @prop({ required: true, ref: User })
  user!: Ref<User>;

  @prop({ required: true, ref: 'Questionnaire' })
  questionnaire!: Ref<Questionnaire>;

  @prop({ required: true, default: false })
  isFinished!: boolean;
}

// Get QuestionnaireAttempt model
export const QuestionnaireAttemptModel = getModelForClass(
  QuestionnaireAttempt,
  {
    schemaOptions: { timestamps: true },
  },
);
