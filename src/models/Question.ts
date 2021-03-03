// Dependencies
import { getModelForClass, post, prop, Ref } from '@typegoose/typegoose';
import { Schema, Types } from 'mongoose';
import { AnswerModel } from './Answer';
import { Questionnare } from './Questionnare';

export enum QuestionType {
  Short,
  Paragraph,
  Choice,
  MultipleChoice,
}

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
export class Question {
  _id?: Types.ObjectId;

  @prop({ required: true })
  name!: string;

  @prop({})
  description?: string;

  @prop({ required: true, default: QuestionType.Short })
  type!: QuestionType;

  @prop({ type: Schema.Types.String })
  options?: string[];

  @prop({ type: Schema.Types.String })
  labels?: string[];

  @prop({ required: true, default: false })
  isRequired!: boolean;

  @prop({ required: true, default: 0 })
  sortOrder!: number;

  @prop({ required: true, type: Schema.Types.ObjectId })
  questionnare!: Ref<Questionnare>;
}

// Get Question model
export const QuestionModel = getModelForClass(Question, {
  schemaOptions: { timestamps: true },
});
