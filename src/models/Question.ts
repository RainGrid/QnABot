// Dependencies
import { getModelForClass, post, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AnswerModel } from './Answer';
import { Questionnare } from './Questionnare';

export enum QuestionType {
  Short,
  Paragraph,
  Choice,
  MultipleChoice,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Question extends Base {}

async function deleteDependencies(question: Question): Promise<void> {
  await AnswerModel.deleteMany({ question });
}

@post<Question>('findOneAndRemove', async (question) => {
  await deleteDependencies(question);
})
@post<Question>('findOneAndDelete', async (question) => {
  await deleteDependencies(question);
})
@post<Question>('remove', async (question) => {
  await deleteDependencies(question);
})
@post<Question>('deleteOne', async (question) => {
  await deleteDependencies(question);
})
@post<Question>('deleteMany', async (questions) => {
  // for (const q of questions) {
  //   await deleteDependencies(q);
  // }
})
export class Question extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({})
  description?: string;

  @prop({ required: true, default: QuestionType.Short, enum: QuestionType })
  type!: QuestionType;

  @prop({ type: () => [String] })
  options?: string[];

  @prop({ type: () => [String] })
  labels?: string[];

  @prop({ required: true, default: false })
  isRequired!: boolean;

  @prop({ required: true, default: 0 })
  sortOrder!: number;

  @prop({ required: true, ref: Questionnare })
  questionnare!: Ref<Questionnare>;
}

// Get Question model
export const QuestionModel = getModelForClass(Question, {
  schemaOptions: { timestamps: true },
});
