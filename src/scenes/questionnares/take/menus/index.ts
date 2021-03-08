import { MenuMiddleware, MenuTemplate } from 'telegraf-inline-menu';
import { Questionnare, QuestionnareAttemptModel } from '../../../../models';
import { TelegrafContext } from '../../../../types';
import { qaSingleMenu } from './qaSingle';

export const takeMenu = new MenuTemplate<TelegrafContext>((ctx) =>
  ctx.i18n.t('questionnares_attempts'),
);

takeMenu.chooseIntoSubmenu(
  'q',
  async (ctx) => {
    const qas = await QuestionnareAttemptModel.find({ user: ctx.dbuser });
    return qas.map((_qa, index) => index.toString());
  },
  qaSingleMenu,
  {
    columns: 2,
    buttonText: async (ctx, key) => {
      const qas = await QuestionnareAttemptModel.find({ user: ctx.dbuser })
        .skip(+key)
        .limit(1)
        .populate('questionnare');
      if (qas?.length) {
        return (qas[0].questionnare as Questionnare).name;
      }
      return '';
    },
  },
);

export const takeMenuMiddleware = new MenuMiddleware('/', takeMenu);
