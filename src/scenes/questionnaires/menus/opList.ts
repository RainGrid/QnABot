import {
  createBackMainMenuButtons,
  getMenuOfPath,
  MenuTemplate,
} from 'telegraf-inline-menu';
import TelegrafStatelessQuestion from 'telegraf-stateless-question';
import { menuMiddleware } from '.';
import { TelegrafContext } from '../../../types';
import { sendMainKeyboard } from '../helpers';
import { getOption, getQuestion } from './helpers';
import { opSingleMenu } from './opSingle';

const qRegex = new RegExp('/qnare:(.*)/qus/qstion:(.*)/ops/$');

export const opListMenu = new MenuTemplate<TelegrafContext>((ctx) => {
  return ctx.i18n.t('options');
});

opListMenu.chooseIntoSubmenu(
  'opt',
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

opListMenu.interact((ctx) => ctx.i18n.t('add_new'), 'optAddName', {
  do: async (ctx, path) => {
    const additionalState = getMenuOfPath(path);

    await optNewName.replyWithMarkdown(
      ctx,
      ctx.i18n.t('add_new_op_req'),
      additionalState,
    );

    return false;
  },
});

opListMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);

export const optNewName = new TelegrafStatelessQuestion<TelegrafContext>(
  'optNewName',
  async (ctx, path) => {
    if ('text' in ctx.message) {
      const answer = ctx.message.text;
      const parts = path.match(qRegex);

      if (parts && parts[1] && parts[2]) {
        const qu = await getQuestion(ctx, +parts[2], +parts[1]);
        if (qu) {
          qu.options ??= [];
          qu.options.push(answer);

          await qu.save();
        }
      }
      await sendMainKeyboard(ctx);
      await menuMiddleware.replyToContext(ctx, path);
    }
  },
);
