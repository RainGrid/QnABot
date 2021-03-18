import {
  MenuMiddleware,
  MenuTemplate,
  replyMenuToContext,
} from 'telegraf-inline-menu';
import { takeMenu } from '.';
import { bot } from '../../../../helpers/bot';
import {
  AnswerModel,
  Question,
  QuestionModel,
  Questionnare,
  QuestionnareAttemptModel,
  QuestionType,
  UserModel,
} from '../../../../models';
import { TelegrafContext } from '../../../../types';

export const qaSingleMenu = new MenuTemplate<TelegrafContext>(async (ctx) => {
  if (ctx.scene.session.data?.qaId) {
    const qa = await QuestionnareAttemptModel.findById(
      ctx.scene.session.data.qaId,
    ).populate('questionnare');
    if (qa && qa.questionnare) {
      if (qa.isFinished) {
        return ctx.i18n.t('qa_finished');
      }

      const qName = (qa.questionnare as Questionnare).name;
      const ans = await AnswerModel.find({ attempt: qa }).populate('question');

      if (ans.length) {
        const an = ans.pop();
        if (an?.question) {
          const q = await QuestionModel.findOne({
            questionnare: qa.questionnare,
            sortOrder: { $gt: (an.question as Question).sortOrder },
          });

          if (q) {
            ctx.scene.session.data.question = q;
          }
        }
      } else {
        const q = await QuestionModel.findOne({
          questionnare: qa.questionnare,
        });
        ctx.scene.session.data.question = q;
      }
      if (ctx.scene.session.data.question) {
        const response = `${qName}\n\n${
          `${ctx.scene.session.data.question.sortOrder + 1}. ${
            ctx.scene.session.data.question.name
          }` +
          (ctx.scene.session.data.question.labels?.length === 1
            ? ' ' + ctx.scene.session.data.question.labels[0]
            : '')
        }\n${ctx.scene.session.data.question.description || ''}`;
        return response;
      } else {
        qa.isFinished = true;
        await qa.save();

        if ((qa.questionnare as Questionnare).isNotificationsEnabled) {
          const owner = await UserModel.findById(
            (qa.questionnare as Questionnare).user,
          );
          if (owner) {
            try {
              await bot.telegram.sendMessage(
                owner.id,
                ctx.i18n.t('qanotification', {
                  qName: (qa.questionnare as Questionnare).name,
                }),
              );
            } catch (error) {}
          }
        }

        return ctx.i18n.t('qa_finished');
      }
    }
  }
  return '--';
});

qaSingleMenu.choose(
  'qa',
  async (ctx) => {
    if (
      ctx.scene.session.data?.question?.options?.length &&
      ctx.scene.session.data?.question?.type === QuestionType.Choice
    ) {
      return ctx.scene.session.data.question.options;
    }
    return [];
  },
  {
    do: async (ctx, op) => {
      if (ctx.scene.session.data?.qaId && ctx.scene.session.data?.question) {
        const qa = await QuestionnareAttemptModel.findById(
          ctx.scene.session.data.qaId,
        );
        if (qa) {
          const an = new AnswerModel({
            answer: op,
            user: ctx.dbuser,
            attempt: qa,
            question: ctx.scene.session.data.question,
          });
          await an.save();

          delete ctx.scene.session.data.question;
        }
      }

      await ctx.answerCbQuery();
      return '.';
    },
    columns: 2,
  },
);

qaSingleMenu.interact(
  (ctx) => {
    if (
      ctx.scene.session.data?.qaId &&
      (ctx.scene.session.data?.question?.type === QuestionType.Short ||
        ctx.scene.session.data?.question?.type === QuestionType.Paragraph)
    ) {
      return ctx.i18n.t('qa_answer_btn');
    }
    return '';
  },
  'qaAnswer',
  {
    do: async (ctx) => {
      ctx.scene.session.data.answerRequired = true;
      await ctx.deleteMessage();
      const msg = await ctx.reply(ctx.i18n.t('qa_answer_req'));
      ctx.scene.session.data.answerReqMsg = msg.message_id;

      await ctx.answerCbQuery();
      return false;
    },
  },
);

qaSingleMenu.interact(
  (ctx) => {
    if (
      ctx.scene.session.data?.qaId &&
      ctx.scene.session.data?.question &&
      !ctx.scene.session.data?.question?.isRequired
    ) {
      return ctx.i18n.t('qa_skip');
    }
    return '';
  },
  'qaSkip',
  {
    do: async (ctx) => {
      if (
        ctx.scene.session.data?.qaId &&
        ctx.scene.session.data?.question &&
        !ctx.scene.session.data?.question?.isRequired
      ) {
        const qa = await QuestionnareAttemptModel.findById(
          ctx.scene.session.data.qaId,
        );
        if (qa) {
          const an = new AnswerModel({
            answer: '-',
            user: ctx.dbuser,
            attempt: qa,
            question: ctx.scene.session.data.question,
          });
          await an.save();

          delete ctx.scene.session.data.question;
        }
      }

      await ctx.answerCbQuery();
      return true;
    },
  },
);

qaSingleMenu.interact((ctx) => ctx.i18n.t('close'), 'qaClose', {
  do: async (ctx) => {
    await ctx.deleteMessage();
    await replyMenuToContext(takeMenu, ctx, 'qasmenu/');

    await ctx.answerCbQuery();
    return false;
  },
});

export const actionHandleAnswer = async (
  ctx: TelegrafContext,
): Promise<void> => {
  if (
    ctx.scene.session.data?.answerRequired &&
    ctx.message &&
    'text' in ctx.message
  ) {
    const answer = ctx.message.text;
    if (ctx.scene.session.data?.qaId && ctx.scene.session.data?.question) {
      const qa = await QuestionnareAttemptModel.findById(
        ctx.scene.session.data.qaId,
      );
      if (qa) {
        const an = new AnswerModel({
          answer,
          user: ctx.dbuser,
          attempt: qa,
          question: ctx.scene.session.data.question,
        });
        await an.save();

        await ctx.deleteMessage();
        await ctx.deleteMessage(ctx.scene.session.data.answerReqMsg);
        delete ctx.scene.session.data.answerRequired;
        delete ctx.scene.session.data.question;
        delete ctx.scene.session.data.answerReqMsg;

        await replyMenuToContext(qaSingleMenu, ctx, 'qamenu/');
      }
    }
  }
};

export const qaMenuMiddleware = new MenuMiddleware('qamenu/', qaSingleMenu);
