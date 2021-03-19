import { TelegrafContext } from '../../../types';
import { getOrCreateAttemptById } from './helpers';

export const actionEnterCodeStep = async (
  ctx: TelegrafContext,
): Promise<void> => {
  ctx.scene.session.data = { step: 'code' };
  await ctx.reply(ctx.i18n.t('qtake_enter_code'));
};

export const actionProcessPayload = async (
  ctx: TelegrafContext,
  next: () => Promise<void>,
): Promise<void> => {
  if (ctx.message && 'text' in ctx.message) {
    if (ctx.scene.session.data?.step === 'code') {
      const code = ctx.message.text;
      const qa = await getOrCreateAttemptById(ctx, code);
      if (qa) {
        ctx.session.qaId = qa._id.toString();
        await ctx.scene.reenter();
      }
      return;
    }
  }
  await next();
};
