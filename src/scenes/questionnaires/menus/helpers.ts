import { DocumentType } from '@typegoose/typegoose';
import {
  Question,
  QuestionModel,
  Questionnaire,
  QuestionnaireModel,
} from '../../../models';
import { TelegrafContext } from '../../../types';

export async function getQuestionnaire(
  ctx: TelegrafContext,
  index?: number,
): Promise<DocumentType<Questionnaire> | null> {
  const q = await QuestionnaireModel.find({ user: ctx.dbuser })
    .skip(index !== undefined ? index : +ctx.match![1])
    .limit(1);
  if (q.length) {
    return q[0];
  }
  return null;
}

export async function getQuestion(
  ctx: TelegrafContext,
  index?: number,
  qIndex?: number,
): Promise<DocumentType<Question> | null> {
  const q = await getQuestionnaire(ctx, qIndex);
  if (q) {
    const qs = await QuestionModel.find({ questionnaire: q })
      .skip(index !== undefined ? index : +ctx.match![2])
      .limit(1);
    if (qs.length) {
      return qs[0];
    }
  }
  return null;
}

export async function getOption(
  ctx: TelegrafContext,
  index?: number,
): Promise<string | null> {
  const qu = await getQuestion(ctx);
  const idx = index !== undefined ? index : +ctx.match![3];
  if (qu && qu.options?.length && idx < qu.options.length) {
    return qu.options[idx];
  }
  return null;
}
