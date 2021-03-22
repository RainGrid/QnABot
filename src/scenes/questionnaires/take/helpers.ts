import { DocumentType } from '@typegoose/typegoose';
import { isValidObjectId, Types } from 'mongoose';
import {
  QuestionnaireAttempt,
  QuestionnaireAttemptModel,
  QuestionnaireModel,
} from '../../../models';
import { Button, TelegrafContext } from '../../../types';
import { enterScene, getDefaultMarkup } from '../../../utils';
import { actionEnterCodeStep } from './actions';

export const buttons: Button[] = [
  {
    cmd: 'qtake_code',
    cb: actionEnterCodeStep,
  },
  {
    cmd: 'back',
    cb: enterScene('questionnaires'),
  },
];

export const sendMainKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('qtake'), getDefaultMarkup(ctx, buttons));
};

export const getOrCreateAttemptById = async (
  ctx: TelegrafContext,
  id: string | Types.ObjectId,
): Promise<DocumentType<QuestionnaireAttempt> | void> => {
  if (!isValidObjectId(id)) {
    await ctx.reply(ctx.i18n.t('qtake_wrong_code'));
    return;
  }

  const q = await QuestionnaireModel.findById(id);
  if (!q) {
    await ctx.reply(ctx.i18n.t('qtake_wrong_code'));
    return;
  }

  if (!q.isEnabled) {
    await ctx.reply(ctx.i18n.t('qtake_disabled'));
    return;
  }

  let qa = await QuestionnaireAttemptModel.findOne({
    questionnaire: q,
    user: ctx.dbuser,
  });
  if (!qa) {
    qa = new QuestionnaireAttemptModel({
      questionnaire: q,
      user: ctx.dbuser,
      isFinished: false,
    });
    await qa.save();
  }

  return qa;
};
