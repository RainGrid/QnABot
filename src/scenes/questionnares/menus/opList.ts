import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { TelegrafContext } from '../../../types';
import { getOption, getQuestion } from './helpers';
import { opSingleMenu } from './opSingle';

export const opListMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.i18n.t('options');
});

opListMenu.chooseIntoSubmenu(
  'op',
  async (ctx) => {
    const q = await getQuestion(ctx);
    if (q && q.options) {
      return q.options.map((_el, index) => index.toString());
    }
    return [];
  },
  opSingleMenu,
  {
    columns: 2,
    buttonText: async (ctx, key) => {
      const op = await getOption(ctx, +key);
      if (op) {
        return op;
      }
      return '--';
    },
  },
);

opListMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
