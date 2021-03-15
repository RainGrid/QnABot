import {
  MenuMiddleware,
  MenuTemplate,
  replyMenuToContext,
} from 'telegraf-inline-menu';
import { Questionnare, QuestionnareAttemptModel } from '../../../../models';
import { TelegrafContext } from '../../../../types';
import { qaSingleMenu } from './qaSingle';

export const takeMenu = new MenuTemplate<TelegrafContext>((ctx) =>
  ctx.i18n.t('questionnares_attempts'),
);

takeMenu.choose(
  'q',
  async (ctx) => {
    const qas = await QuestionnareAttemptModel.find({
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
      const qa = await QuestionnareAttemptModel.findById(key).populate(
        'questionnare',
      );
      if (qa) {
        return (qa.questionnare as Questionnare).name;
      }
      return '';
    },
  },
);

export const takeMenuMiddleware = new MenuMiddleware('qasmenu/', takeMenu);
