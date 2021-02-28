// Dependencies
import { getModelForClass, post, prop, Ref } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { Answer, AnswerModel } from './Answer';
import { Questionnare } from './Questionnare';

export enum QuestionType {
  Short,
  Paragraph,
  Choice,
  MultipleChoice,
}

async function deleteDependencies(question: Question): Promise<void> {
  await AnswerModel.deleteMany({ question: question._id.toString() });
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
  for (const q of questions) {
    await deleteDependencies(q);
  }
})
export class Question {
  _id: Schema.Types.ObjectId;

  @prop({ required: true, index: true, unique: true })
  name!: string;

  @prop({ required: true, default: QuestionType.Short })
  type!: QuestionType;

  @prop()
  options?: string[];

  @prop({ required: true, default: false })
  isRequired!: boolean;

  @prop({ required: true, default: 0 })
  sortOrder!: number;

  @prop({ required: true })
  questionnare!: Ref<Questionnare>;
}

// Get Question model
export const QuestionModel = getModelForClass(Question, {
  schemaOptions: { timestamps: true },
});
