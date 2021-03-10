import {
  createBackMainMenuButtons,
  getMenuOfPath,
  MenuTemplate,
  replyMenuToContext,
} from 'telegraf-inline-menu';
import TelegrafStatelessQuestion from 'telegraf-stateless-question';
import { QuestionModel, QuestionType } from '../../../models';
import { TelegrafContext } from '../../../types';
import { sendMainKeyboard } from '../helpers';
import { getQuestion, getQuestionnare } from './helpers';
import { quSingleMenu } from './quSingle';

const qRegex = new RegExp('/q:(.*)/qus/$');

export const quListMenu = new MenuTemplate<TelegrafContext>((ctx, path) => {
  if (!ctx.match) {
    ctx.match = qRegex.exec(path) || undefined;
  }
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

quListMenu.interact((ctx) => ctx.i18n.t('add_new'), 'quEditName', {
  do: async (ctx, path) => {
    const additionalState = getMenuOfPath(path);
    await quNewName.replyWithMarkdown(
      ctx,
      ctx.i18n.t('add_new_req'),
      additionalState,
    );
    return true;
  },
});

quListMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);

export const quNewName = new TelegrafStatelessQuestion<TelegrafContext>(
  'quName',
  async (ctx, path) => {
    if ('text' in ctx.message) {
      const answer = ctx.message.text;
      const parts = path.match(qRegex);
      if (parts && parts[1]) {
        const id = parts[1];
        const q = await getQuestionnare(ctx, +id);
        if (q) {
          const qus = await QuestionModel.find({ questionnare: q });
          const qu = new QuestionModel({
            name: answer,
            type: QuestionType.Short,
            isRequired: false,
            questionnare: q,
            sortOrder: qus.length,
          });
          await qu.save();
        }
      }
      await replyMenuToContext(quListMenu, ctx, path);
      await sendMainKeyboard(ctx);
    }
  },
);
