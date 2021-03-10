import dayjs = require('dayjs');
import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { QuestionnareAttemptModel } from '../../../models';
import { TelegrafContext } from '../../../types';
import { getQuestionnare } from './helpers';

const periods = ['day', 'week', 'month', 'year', 'alltime'];

async function getStats(
  ctx: TelegrafContext,
  period: string,
): Promise<string | void> {
  let dateFrom: Date | undefined;
  if (period !== 'alltime') {
    dateFrom = dayjs()
      .subtract(1, period as any)
      .toDate();
  }

  const q = await getQuestionnare(ctx);
  if (q) {
    const query: any = { questionnare: q };
    if (dateFrom) {
      query.createdAt = { $gte: dateFrom };
    }
    const attempts = await QuestionnareAttemptModel.find(query);
    return ctx.i18n.t('qstats_count', {
      period: ctx.i18n.t(period).toLowerCase(),
      commonCount: attempts.length,
      finishedCount: attempts.filter((el) => el.isFinished).length,
    });
  }
}

export const qStatsMenu = new MenuTemplate<TelegrafContext>(async (ctx) => {
  const q = await getQuestionnare(ctx);
  if (q) {
    return `${q.name} statistics`;
  }
  return '';
});

qStatsMenu.choose('stP', periods, {
  do: async (ctx, key) => {
    const answer = await getStats(ctx, key);
    if (answer) {
      await ctx.reply(answer);
    }
    await ctx.answerCbQuery();
    return false;
  },
  columns: 2,
  buttonText: (ctx, key) => ctx.i18n.t(key),
});

qStatsMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
