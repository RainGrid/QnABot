import {
  createBackMainMenuButtons,
  getMenuOfPath,
  MenuTemplate,
} from 'telegraf-inline-menu';
import TelegrafStatelessQuestion from 'telegraf-stateless-question';
import { menuMiddleware } from '.';
import { QuestionModel, QuestionType } from '../../../models';
import { TelegrafContext } from '../../../types';
import { sendMainKeyboard } from '../helpers';
import { getQuestion, getQuestionnaire } from './helpers';
import { quSingleMenu } from './quSingle';

const qRegex = new RegExp('/qnare:(.*)/qus/$');

export const quListMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.i18n.t('questions');
});

quListMenu.chooseIntoSubmenu(
  'qstion',
  async (ctx) => {
    const q = await getQuestionnaire(ctx);
    if (q) {
      const qs = await QuestionModel.find({ questionnaire: q });
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

quListMenu.interact((ctx) => ctx.i18n.t('add_new'), 'quAddName', {
  do: async (ctx, path) => {
    const additionalState = getMenuOfPath(path);

    await quNewName.replyWithMarkdown(
      ctx,
      ctx.i18n.t('add_new_req'),
      additionalState,
    );

    return false;
  },
});

quListMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);

export const quNewName = new TelegrafStatelessQuestion<TelegrafContext>(
  'quNewName',
  async (ctx, path) => {
    if ('text' in ctx.message) {
      const answer = ctx.message.text;
      const parts = path.match(qRegex);
      if (parts && parts[1]) {
        const id = parts[1];
        const q = await getQuestionnaire(ctx, +id);
        if (q) {
          const qus = await QuestionModel.find({ questionnaire: q });
          const qu = new QuestionModel({
            name: answer,
            type: QuestionType.Short,
            isRequired: false,
            questionnaire: q,
            sortOrder: qus.length ? qus[qus.length - 1].sortOrder + 1 : 0,
          });
          await qu.save();
        }
      }
      await sendMainKeyboard(ctx);
      await menuMiddleware.replyToContext(ctx, path);
    }
  },
);
