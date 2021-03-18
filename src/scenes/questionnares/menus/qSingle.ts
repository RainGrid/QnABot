import {
  createBackMainMenuButtons,
  getMenuOfPath,
  MenuTemplate,
  replyMenuToContext,
} from 'telegraf-inline-menu';
import TelegrafStatelessQuestion from 'telegraf-stateless-question';
import { TelegrafContext } from '../../../types';
import { sendMainKeyboard } from '../helpers';
import { getQuestionnare } from './helpers';
import { qStatsMenu } from './qStats';
import { quListMenu } from './quList';

const qRegex = new RegExp('/q:(.*)/$');

export const qSingleMenu = new MenuTemplate<TelegrafContext>(
  async (ctx, path) => {
    if (!ctx.match) {
      ctx.match = qRegex.exec(path) || undefined;
    }
    const q = await getQuestionnare(ctx);
    if (q) {
      return `${q.name}\n${
        q.description || 'no description'
      }\n\n${ctx.i18n.t('qlink', { qId: q._id.toString() })}`;
    }
    return '';
  },
);

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

qSingleMenu.toggle((ctx) => ctx.i18n.t('qenabled'), 'en', {
  set: async (ctx, choice) => {
    const q = await getQuestionnare(ctx);
    if (q) {
      q.isEnabled = choice;
      await q.save();
    }
    return true;
  },
  isSet: async (ctx) => {
    const q = await getQuestionnare(ctx);
    if (q) {
      return q.isEnabled;
    }
    return false;
  },
});

qSingleMenu.toggle((ctx) => ctx.i18n.t('qnotifications'), 'not', {
  joinLastRow: true,
  set: async (ctx, choice) => {
    const q = await getQuestionnare(ctx);
    if (q) {
      q.isNotificationsEnabled = choice;
      await q.save();
    }
    return true;
  },
  isSet: async (ctx) => {
    const q = await getQuestionnare(ctx);
    if (q) {
      return q.isNotificationsEnabled;
    }
    return false;
  },
});

qSingleMenu.submenu((ctx) => ctx.i18n.t('qstats'), 'st', qStatsMenu);

qSingleMenu.interact((ctx) => ctx.i18n.t('delete'), 'del', {
  do: async (ctx) => {
    const q = await getQuestionnare(ctx);
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
        const q = await getQuestionnare(ctx, +id);
        if (q) {
          q.name = answer;
          await q.save();
        }
      }
      await sendMainKeyboard(ctx);
      await replyMenuToContext(qSingleMenu, ctx, path);
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
        const q = await getQuestionnare(ctx, +id);
        if (q) {
          q.description = answer;
          await q.save();
        }
      }
      await sendMainKeyboard(ctx);
      await replyMenuToContext(qSingleMenu, ctx, path);
    }
  },
);
