import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { TelegrafContext } from '../../../types';
import { getOption, getQuestion } from './helpers';

export const opSingleMenu = new MenuTemplate<TelegrafContext>(async (ctx) => {
  const op = await getOption(ctx);
  if (op) {
    return op;
  }
  return '--';
});

opSingleMenu.interact((ctx) => ctx.i18n.t('delete'), 'del', {
  do: async (ctx) => {
    const q = await getQuestion(ctx);
    if (q && q.options?.length && +ctx.match![3] < q.options.length) {
      q.options.splice(+ctx.match![3], 1);
      await q.save();
    }
    return '..';
  },
});

opSingleMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
