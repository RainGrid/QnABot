import {
  MenuMiddleware,
  MenuTemplate,
  replyMenuToContext,
} from 'telegraf-inline-menu';
import { Questionnaire, QuestionnaireAttemptModel } from '../../../../models';
import { TelegrafContext } from '../../../../types';
import { qaSingleMenu } from './qaSingle';

export const takeMenu = new MenuTemplate<TelegrafContext>((ctx) =>
  ctx.i18n.t('questionnaires_attempts'),
);

takeMenu.choose(
  'qat',
  async (ctx) => {
    const qas = await QuestionnaireAttemptModel.find({
      user: ctx.dbuser,
    });
    return qas.map((qa) => qa._id.toString());
  },
  {
    do: async (ctx, qaId) => {
      ctx.scene.session.data = { qaId };
      await replyMenuToContext(qaSingleMenu, ctx, 'qamenu/');
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return false;
    },
    columns: 2,
    buttonText: async (ctx, key) => {
      const qa = await QuestionnaireAttemptModel.findById(key).populate(
        'questionnaire',
      );

      if (qa?.questionnaire) {
        return (qa.questionnaire as Questionnaire).name;
      }
      return '';
    },
  },
);

takeMenu.interact((ctx) => ctx.i18n.t('close'), 'qasClose', {
  do: async (ctx) => {
    await ctx.deleteMessage();
    return false;
  },
});

export const takeMenuMiddleware = new MenuMiddleware('qasmenu/', takeMenu);
