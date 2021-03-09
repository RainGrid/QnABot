// Dependencies
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Questionnare } from './Questionnare';
import { User } from './User';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QuestionnareAttempt extends Base {}

export class QuestionnareAttempt extends TimeStamps {
  @prop({ required: true, ref: User })
  user!: Ref<User>;

  @prop({ required: true, ref: Questionnare })
  questionnare!: Ref<Questionnare>;

  @prop({ required: true, default: false })
  isFinished!: boolean;
}

// Get QuestionnareAttempt model
export const QuestionnareAttemptModel = getModelForClass(QuestionnareAttempt, {
  schemaOptions: { timestamps: true },
});
