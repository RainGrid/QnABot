import dayjs = require('dayjs');
import { DocumentType } from '@typegoose/typegoose';
import { MongooseFilterQuery } from 'mongoose';
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

enum StatisticPeriod {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  AllTime = 'alltime',
}

const periods = [
  StatisticPeriod.Day,
  StatisticPeriod.Week,
  StatisticPeriod.Month,
  StatisticPeriod.Year,
  StatisticPeriod.AllTime,
];

async function getStats(
  ctx: TelegrafContext,
  period: StatisticPeriod,
): Promise<string | void> {
  const q = await getQuestionnare(ctx);
  if (q) {
    const query: MongooseFilterQuery<DocumentType<QuestionnareAttempt>> = {
      questionnare: q,
    };
    if (period !== StatisticPeriod.AllTime) {
      query.createdAt = { $gte: dayjs().subtract(1, period).toDate() };
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

qStatsMenu.choose('qnarestP', periods, {
  do: async (ctx, key) => {
    if (
      Object.values(StatisticPeriod).find((period) => period.toString() === key)
    ) {
      const answer = await getStats(ctx, key as StatisticPeriod);
      if (answer) {
        await ctx.reply(answer);
      }
      await ctx.answerCbQuery();
    }
    return false;
  },
  columns: 2,
  buttonText: (ctx, key) => ctx.i18n.t(key),
});

qStatsMenu.interact((ctx) => ctx.i18n.t('export'), 'qnarestExport', {
  joinLastRow: true,
  do: async (ctx) => {
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
