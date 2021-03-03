// Dependencies
import { getModelForClass, post, prop, Ref } from '@typegoose/typegoose';
import { Schema, Types } from 'mongoose';
import { User } from '.';
import { QuestionModel } from './Question';

async function deleteDependencies(questionnare: Questionnare): Promise<void> {
  await QuestionModel.deleteMany({ questionnare });
}
@post<Questionnare>('findOneAndRemove', async (questionnare) => {
  await deleteDependencies(questionnare);
})
@post<Questionnare>('findOneAndDelete', async (questionnare) => {
  await deleteDependencies(questionnare);
})
@post<Questionnare>('remove', async (questionnare) => {
  await deleteDependencies(questionnare);
})
@post<Questionnare>('deleteOne', async (questionnare) => {
  await deleteDependencies(questionnare);
})
@post<Questionnare>('deleteMany', async (questionnare) => {
  // for (const q of questionnare) {
  //   await deleteDependencies(q);
  // }
})
export class Questionnare {
  _id?: Types.ObjectId;

  @prop({ required: true })
  name!: string;

  @prop({ required: true, type: Schema.Types.ObjectId })
  user!: Ref<User>;

  @prop({})
  description?: string;

  @prop({ required: true, default: false })
  isEnabled!: boolean;
}

// Get Questionnare model
export const QuestionnareModel = getModelForClass(Questionnare, {
  schemaOptions: { timestamps: true },
});
