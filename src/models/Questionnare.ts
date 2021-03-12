// Dependencies
import {
  DocumentType,
  getModelForClass,
  post,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { QuestionnareAttemptModel } from './QuestionnareAttempt';
import { QuestionModel } from './Question';
import { User } from './User';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Questionnare extends Base {}

async function deleteDependencies(
  questionnare: DocumentType<Questionnare>,
): Promise<void> {
  await QuestionModel.deleteMany({ questionnare });
  await QuestionnareAttemptModel.deleteMany({ questionnare });
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
@post<Questionnare>('deleteMany', async (questionnares) => {
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
