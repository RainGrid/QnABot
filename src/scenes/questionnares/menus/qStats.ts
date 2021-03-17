import dayjs = require('dayjs');
import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import {
  Answer,
  QuestionModel,
  QuestionnareAttempt,
  QuestionnareAttemptModel,
} from '../../../models';
import { TelegrafContext } from '../../../types';
import { getQuestionnare } from './helpers';
import fs = require('fs');

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

qStatsMenu.interact((ctx) => ctx.i18n.t('export'), 'qExport', {
  joinLastRow: true,
  do: async (ctx, path) => {
    const q = await getQuestionnare(ctx);
    if (q) {
      const answers = await QuestionnareAttemptModel.aggregate<
        QuestionnareAttempt & { answers: Answer[] }
      >([
        {
          $match: { questionnare: q._id, isFinished: true },
        },
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'attempt',
            as: 'answers',
          },
        },
      ]);
      const questions = await QuestionModel.find({ questionnare: q }).sort({
        sortOrder: 1,
      });
      const header =
        [ctx.i18n.t('timestamp')]
          .concat(questions.map((qu) => qu.name))
          .join(';') + '\n';
      const body = answers
        .map((at) =>
          [dayjs(at.updatedAt).format('DD.MM.YYYY HH:mm:ss')]
            .concat(at.answers.map((an) => an.answer))
            .join(';'),
        )
        .join('\n');
      const response = header + body;
      const filename = `./export_${q.name}_${dayjs().format(
        'DD.MM.YYYY_HH_mm_ss',
      )}.csv`;
      fs.writeFileSync(filename, '\ufeff' + response, 'utf8');
      await ctx.replyWithDocument({ source: filename });
      fs.unlinkSync(filename);
    }
    return false;
  },
});

qStatsMenu.manualRow(
  createBackMainMenuButtons(
    (ctx) => ctx.i18n.t('back'),
    (ctx) => ctx.i18n.t('mainmenu'),
  ),
);
