import { isValidObjectId } from 'mongoose';
import { QuestionnareAttemptModel, QuestionnareModel } from '../../../models';
import { TelegrafContext } from '../../../types';

export const actionEnterCodeStep = async (
  ctx: TelegrafContext,
): Promise<void> => {
  ctx.scene.session.data = { step: 'code' };
  await ctx.reply(ctx.i18n.t('qtake_enter_code'));
};

export const actionProcessPayload = async (
  ctx: TelegrafContext,
): Promise<void> => {
  if (ctx.message && 'text' in ctx.message) {
    if (ctx.scene.session.data?.step === 'code') {
      const code = ctx.message.text;
      if (!isValidObjectId(code)) {
        await ctx.reply(ctx.i18n.t('qtake_wrong_code'));
        return;
      }
      const q = await QuestionnareModel.findById(code);
      if (!q) {
        await ctx.reply(ctx.i18n.t('qtake_wrong_code'));
        return;
      }
      ctx.session.questionnareID = code;
      ctx.scene.reenter();
    }
  }
};
