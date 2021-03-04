import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { TelegrafContext } from '../../../types';
import { getQuestion } from './helpers';
import { opListMenu } from './opList';

export const quSingleMenu = new MenuTemplate<TelegrafContext>(async (ctx) => {
  const qu = await getQuestion(ctx);
  if (qu) {
    return qu.name;
  }
  return '--';
});

quSingleMenu.submenu((ctx) => ctx.i18n.t('options'), 'ops', opListMenu);

quSingleMenu.interact((ctx) => ctx.i18n.t('delete'), 'del', {
  do: async (ctx) => {
    const qu = await getQuestion(ctx);
    if (qu) {
      await qu.remove();
    }
    return '..';
  },
});

quSingleMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
