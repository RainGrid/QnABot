import { MenuMiddleware, MenuTemplate } from 'telegraf-inline-menu';
import { QuestionnareModel } from '../../../models';
import { TelegrafContext } from '../../../types';
import { qSingleMenu } from './qSingle';

export const menu = new MenuTemplate<TelegrafContext>((ctx) =>
  ctx.i18n.t('questionnares'),
);

menu.chooseIntoSubmenu(
  'q',
  async (ctx) => {
    const qs = await QuestionnareModel.find({ user: ctx.dbuser });
    return qs.map((_q, index) => index.toString());
  },
  qSingleMenu,
  {
    columns: 2,
    buttonText: async (ctx, key) => {
      const q = await QuestionnareModel.find({ user: ctx.dbuser })
        .skip(+key)
        .limit(1);
      if (q?.length) {
        return q[0].name;
      }
      return '';
    },
  },
);

export const menuMiddleware = new MenuMiddleware('/', menu);
