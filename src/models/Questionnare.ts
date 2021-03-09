// Dependencies
import { getModelForClass, post, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './User';
import { QuestionModel } from './Question';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Questionnare extends Base {}

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
export class Questionnare extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, ref: User })
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
