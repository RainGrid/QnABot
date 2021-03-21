import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { QuestionType } from '../../../models';
import { TelegrafContext } from '../../../types';
import { getQuestion } from './helpers';

export const typeListMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.i18n.t('type');
});

typeListMenu.choose(
  'typ',
  async () => {
    return Object.values(QuestionType)
      .filter((value) => !isNaN(Number(value)))
      .map((index) => index.toString());
  },
  {
    columns: 2,
    buttonText: (ctx, key) => {
      return ctx.i18n.t('type' + key);
    },
    do: async (ctx, key) => {
      const qu = await getQuestion(ctx);
      if (qu) {
        qu.type = +key;
        await qu.save();
      }
      return '..';
    },
  },
);

typeListMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
