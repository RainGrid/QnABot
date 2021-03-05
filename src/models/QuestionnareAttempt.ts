// Dependencies
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Schema, Types } from 'mongoose';
import { Questionnare } from './Questionnare';
import { User } from './User';

export class QuestionnareAttempt extends TimeStamps {
  _id?: Types.ObjectId;

  @prop({ required: true, type: Schema.Types.ObjectId })
  user!: Ref<User>;

  @prop({ required: true, type: Schema.Types.ObjectId })
  questionnare!: Ref<Questionnare>;

  @prop({ required: true, default: false })
  isFinished!: boolean;
}

// Get QuestionnareAttempt model
export const QuestionnareAttemptModel = getModelForClass(QuestionnareAttempt, {
  schemaOptions: { timestamps: true },
});
