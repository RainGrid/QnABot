import { QuestionnaireModel } from '../../../models';
import { TelegrafContext } from '../../../types';

export const actionProcessPayload = async (
  ctx: TelegrafContext,
): Promise<void> => {
  if (ctx.message && 'text' in ctx.message) {
    if (ctx.scene.session.data?.step === 'qname') {
      const name = ctx.message.text;
      if (name) {
        ctx.scene.session.data.name = name;
        ctx.scene.session.data.step = 'qdescr';
        await ctx.reply(ctx.i18n.t('qnew_descr'));
        return;
      }
    }
    if (ctx.scene.session.data?.step === 'qdescr') {
      const description = ctx.message.text;
      if (description) {
        const q = new QuestionnaireModel({
          name: ctx.scene.session.data.name,
          description,
          user: ctx.dbuser,
        });
        await q.save();

        await ctx.reply(ctx.i18n.t('qnew_success'));
        ctx.scene.enter('questionnaires');
        return;
      }
    }
  }
};
