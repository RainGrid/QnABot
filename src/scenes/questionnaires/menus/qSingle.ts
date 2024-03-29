import {
  createBackMainMenuButtons,
  getMenuOfPath,
  MenuTemplate,
} from 'telegraf-inline-menu';
import TelegrafStatelessQuestion from 'telegraf-stateless-question';
import { menuMiddleware } from '.';
import { TelegrafContext } from '../../../types';
import { sendMainKeyboard } from '../helpers';
import { getQuestionnaire } from './helpers';
import { qStatsMenu } from './qStats';
import { quListMenu } from './quList';

const qRegex = new RegExp('/qnare:(.*)/$');

export const qSingleMenu = new MenuTemplate<TelegrafContext>(async (ctx) => {
  const q = await getQuestionnaire(ctx);
  if (q) {
    return `${q.name}\n${
      q.description || 'no description'
    }\n\n${ctx.i18n.t('qlink', { qId: q._id.toString() })}`;
  }
  return '';
});

qSingleMenu.submenu((ctx) => ctx.i18n.t('questions'), 'qus', quListMenu);

qSingleMenu.interact((ctx) => ctx.i18n.t('edit_name'), 'qEditName', {
  do: async (ctx, path) => {
    const additionalState = getMenuOfPath(path);
    await qName.replyWithMarkdown(
      ctx,
      ctx.i18n.t('edit_name_req'),
      additionalState,
    );
    return true;
  },
});

qSingleMenu.interact((ctx) => ctx.i18n.t('edit_descr'), 'qEditDescr', {
  joinLastRow: true,
  do: async (ctx, path) => {
    const additionalState = getMenuOfPath(path);
    await qDescr.replyWithMarkdown(
      ctx,
      ctx.i18n.t('edit_descr_req'),
      additionalState,
    );
    return true;
  },
});

qSingleMenu.toggle((ctx) => ctx.i18n.t('qenabled'), 'qen', {
  set: async (ctx, choice) => {
    const q = await getQuestionnaire(ctx);
    if (q) {
      q.isEnabled = choice;
      await q.save();
    }
    return true;
  },
  isSet: async (ctx) => {
    const q = await getQuestionnaire(ctx);
    if (q) {
      return q.isEnabled;
    }
    return false;
  },
});

qSingleMenu.toggle((ctx) => ctx.i18n.t('qnotifications'), 'qnot', {
  joinLastRow: true,
  set: async (ctx, choice) => {
    const q = await getQuestionnaire(ctx);
    if (q) {
      q.isNotificationsEnabled = choice;
      await q.save();
    }
    return true;
  },
  isSet: async (ctx) => {
    const q = await getQuestionnaire(ctx);
    if (q) {
      return q.isNotificationsEnabled;
    }
    return false;
  },
});

qSingleMenu.submenu((ctx) => ctx.i18n.t('qstats'), 'qnarest', qStatsMenu);

qSingleMenu.interact((ctx) => ctx.i18n.t('delete'), 'qdel', {
  do: async (ctx) => {
    const q = await getQuestionnaire(ctx);
    if (q) {
      await q.remove();
    }
    return '..';
  },
});

qSingleMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);

export const qName = new TelegrafStatelessQuestion<TelegrafContext>(
  'qName',
  async (ctx, path) => {
    if ('text' in ctx.message) {
      const answer = ctx.message.text;
      const parts = path.match(qRegex);
      if (parts && parts[1]) {
        const id = parts[1];
        const q = await getQuestionnaire(ctx, +id);
        if (q) {
          q.name = answer;
          await q.save();
        }
      }
      await sendMainKeyboard(ctx);
      await menuMiddleware.replyToContext(ctx, path);
    }
  },
);

export const qDescr = new TelegrafStatelessQuestion<TelegrafContext>(
  'qDescr',
  async (ctx, path) => {
    if ('text' in ctx.message) {
      const answer = ctx.message.text;
      const parts = path.match(qRegex);

      if (parts && parts[1]) {
        const id = parts[1];
        const q = await getQuestionnaire(ctx, +id);
        if (q) {
          q.description = answer;
          await q.save();
        }
      }
      await sendMainKeyboard(ctx);
      await menuMiddleware.replyToContext(ctx, path);
    }
  },
);
