import { MenuMiddleware, MenuTemplate } from 'telegraf-inline-menu';
import { QuestionnaireModel } from '../../../models';
import { TelegrafContext } from '../../../types';
import { qSingleMenu } from './qSingle';

export const menu = new MenuTemplate<TelegrafContext>((ctx) =>
  ctx.i18n.t('questionnaires_your'),
);

menu.chooseIntoSubmenu(
  'qnare',
  async (ctx) => {
    const qs = await QuestionnaireModel.find({ user: ctx.dbuser });
    return qs.map((_q, index) => index.toString());
  },
  qSingleMenu,
  {
    columns: 2,
    buttonText: async (ctx, key) => {
      const q = await QuestionnaireModel.find({ user: ctx.dbuser })
        .skip(+key)
        .limit(1);
      if (q?.length) {
        return `${+key + 1}. ${q[0].name}`;
      }
      return '';
    },
  },
);

menu.interact((ctx) => ctx.i18n.t('close'), 'qsClose', {
  do: async (ctx) => {
    await ctx.deleteMessage();
    return false;
  },
});

export const menuMiddleware = new MenuMiddleware('/', menu);
