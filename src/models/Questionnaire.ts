// Dependencies
import {
  DocumentType,
  getModelForClass,
  post,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { QuestionnaireAttemptModel } from './QuestionnaireAttempt';
import { QuestionModel } from './Question';
import { User } from './User';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Questionnaire extends Base {}

async function deleteDependencies(
  questionnaire: DocumentType<Questionnaire>,
): Promise<void> {
  await QuestionModel.deleteMany({ questionnaire });
  await QuestionnaireAttemptModel.deleteMany({ questionnaire });
}
@post<Questionnaire>('findOneAndRemove', async (questionnaire) => {
  await deleteDependencies(questionnaire);
})
@post<Questionnaire>('findOneAndDelete', async (questionnaire) => {
  await deleteDependencies(questionnaire);
})
@post<Questionnaire>('remove', async (questionnaire) => {
  await deleteDependencies(questionnaire);
})
@post<Questionnaire>('deleteOne', async (questionnaire) => {
  await deleteDependencies(questionnaire);
})
@post<Questionnaire>('deleteMany', async (questionnaires) => {
  // for (const q of questionnaire) {
  //   await deleteDependencies(q);
  // }
})
export class Questionnaire extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, ref: User })
  user!: Ref<User>;

  @prop({})
  description?: string;

  @prop({ required: true, default: false })
  isEnabled!: boolean;

  @prop({ required: true, default: false })
  isNotificationsEnabled!: boolean;
}

// Get Questionnaire model
export const QuestionnaireModel = getModelForClass(Questionnaire, {
  schemaOptions: { timestamps: true },
});
