// Dependencies
import { getModelForClass, post, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { QuestionModel } from './Question';

async function deleteDependencies(questionnare: Questionnare): Promise<void> {
  await QuestionModel.deleteMany({ questionnare: questionnare._id.toString() });
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
  for (const q of questionnare) {
    await deleteDependencies(q);
  }
})
export class Questionnare {
  _id: Schema.Types.ObjectId;

  @prop({ required: true, index: true, unique: true })
  name!: string;

  @prop({})
  description?: string;

  @prop({ required: true, default: false })
  isEnabled!: boolean;
}

// Get Questionnare model
export const QuestionnareModel = getModelForClass(Questionnare, {
  schemaOptions: { timestamps: true },
});
