import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { QuestionModel } from '../../../models';
import { TelegrafContext } from '../../../types';
import { getQuestion, getQuestionnare } from './helpers';
import { quSingleMenu } from './quSingle';

export const quListMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.i18n.t('questions');
});

quListMenu.chooseIntoSubmenu(
  'qu',
  async (ctx) => {
    const q = await getQuestionnare(ctx);
    if (q) {
      const qs = await QuestionModel.find({ questionnare: q });
      return qs.map((_q, index) => index);
    }
    return [];
  },
  quSingleMenu,
  {
    columns: 2,
    buttonText: async (ctx, key) => {
      const qs = await getQuestion(ctx, +key);
      if (qs) {
        return qs.name;
      }
      return '--';
    },
  },
);

quListMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
