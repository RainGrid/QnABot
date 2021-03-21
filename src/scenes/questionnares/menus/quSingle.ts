import {
  createBackMainMenuButtons,
  getMenuOfPath,
  MenuTemplate,
} from 'telegraf-inline-menu';
import TelegrafStatelessQuestion from 'telegraf-stateless-question';
import { menuMiddleware } from '.';
import { QuestionType } from '../../../models';
import { TelegrafContext } from '../../../types';
import { sendMainKeyboard } from '../helpers';
import { getQuestion } from './helpers';
import { opListMenu } from './opList';
import { typeListMenu } from './typeList';

const qRegex = new RegExp('/qnare:(.*)/qus/qstion:(.*)/$');

export const quSingleMenu = new MenuTemplate<TelegrafContext>(async (ctx) => {
  const qu = await getQuestion(ctx);
  if (qu) {
    return `${qu.name}\n${ctx.i18n.t('type')}: ${ctx.i18n.t(
      'type' + qu.type.toString(),
    )}\n${qu.description || ''}`;
  }
  return '--';
});

quSingleMenu.submenu(
  async (ctx) => {
    const qu = await getQuestion(ctx);
    if (
      qu &&
      !(qu.type === QuestionType.Short || qu.type === QuestionType.Paragraph)
    ) {
      return ctx.i18n.t('options');
    }
    return '';
  },
  'ops',
  opListMenu,
);

quSingleMenu.interact((ctx) => ctx.i18n.t('edit_name'), 'quEditName', {
  do: async (ctx, path) => {
    const additionalState = getMenuOfPath(path);
    await quName.replyWithMarkdown(
      ctx,
      ctx.i18n.t('edit_name_req'),
      additionalState,
    );
    return true;
  },
});

quSingleMenu.interact((ctx) => ctx.i18n.t('edit_descr'), 'quEditDescr', {
  joinLastRow: true,
  do: async (ctx, path) => {
    const additionalState = getMenuOfPath(path);
    await quDescr.replyWithMarkdown(
      ctx,
      ctx.i18n.t('edit_descr_req'),
      additionalState,
    );
    return true;
  },
});

quSingleMenu.toggle((ctx) => ctx.i18n.t('qurequired'), 'qureq', {
  set: async (ctx, choice) => {
    const qu = await getQuestion(ctx);
    if (qu) {
      qu.isRequired = choice;
      await qu.save();
    }
    return true;
  },
  isSet: async (ctx) => {
    const qu = await getQuestion(ctx);
    if (qu) {
      return qu.isRequired;
    }
    return false;
  },
});

quSingleMenu.submenu((ctx) => ctx.i18n.t('type'), 'qutype', typeListMenu);

quSingleMenu.interact((ctx) => ctx.i18n.t('delete'), 'qudel', {
  joinLastRow: true,
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

export const quName = new TelegrafStatelessQuestion<TelegrafContext>(
  'quName',
  async (ctx, path) => {
    if ('text' in ctx.message) {
      const answer = ctx.message.text;
      const parts = path.match(qRegex);
      if (parts && parts[1] && parts[2]) {
        const qu = await getQuestion(ctx, +parts[2], +parts[1]);
        if (qu) {
          qu.name = answer;
          await qu.save();
        }
      }
      await sendMainKeyboard(ctx);
      await menuMiddleware.replyToContext(ctx, path);
    }
  },
);

export const quDescr = new TelegrafStatelessQuestion<TelegrafContext>(
  'quDescr',
  async (ctx, path) => {
    if ('text' in ctx.message) {
      const answer = ctx.message.text;
      const parts = path.match(qRegex);
      if (parts && parts[1] && parts[2]) {
        const qu = await getQuestion(ctx, +parts[2], +parts[1]);
        if (qu) {
          qu.description = answer;
          await qu.save();
        }
      }
      await sendMainKeyboard(ctx);
      await menuMiddleware.replyToContext(ctx, path);
    }
  },
);
