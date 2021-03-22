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
  const { data } = ctx.scene.session;
  if (data?.qaId) {
    const qa = await QuestionnareAttemptModel.findById(data.qaId).populate(
      'questionnare',
    );
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
            data.question = q;
          }
        }
      } else {
        const q = await QuestionModel.findOne({
          questionnare: qa.questionnare,
        });
        data.question = q;
      }
      if (data.question) {
        const response = `${qName}\n\n${`${data.question.sortOrder + 1}. ${
          data.question.name
        }`}\n${data.question.description || ''}`;
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
  'qatopts',
  async (ctx) => {
    const { data } = ctx.scene.session;
    if (
      data?.question?.options?.length &&
      data.question.type === QuestionType.Choice
    ) {
      return data.question.options.map((op: string) => op.replace('/', '|'));
    }
    return [];
  },
  {
    do: async (ctx, op) => {
      const { data } = ctx.scene.session;
      if (data?.qaId && data?.question) {
        const qa = await QuestionnareAttemptModel.findById(data.qaId);
        if (qa) {
          const an = new AnswerModel({
            answer: op,
            user: ctx.dbuser,
            attempt: qa,
            question: data.question,
          });
          await an.save();

          delete data.question;
        }
      }

      await ctx.answerCbQuery();
      return '.';
    },
    columns: 2,
  },
);

qaSingleMenu.select(
  'qatoptsmulti',
  async (ctx) => {
    const { data } = ctx.scene.session;
    if (
      data?.question?.options?.length &&
      data.question.type === QuestionType.MultipleChoice
    ) {
      return data.question.options.map((op: string) => op.replace('/', '|'));
    }
    return [];
  },
  {
    set: async (ctx, op, newState) => {
      const { data } = ctx.scene.session;
      if (data?.qaId && data?.question) {
        data.selections ??= [];
        if (newState) {
          data.selections.push(op);
        } else {
          data.selections = data.selections.filter((el: string) => el !== op);
        }
      }

      await ctx.answerCbQuery();
      return true;
    },
    isSet: async (ctx, op) => {
      let isOpSet = false;
      const { data } = ctx.scene.session;
      if (data?.qaId && data.question) {
        data.selections ??= [];
        isOpSet = data.selections.includes(op);
      }
      return isOpSet;
    },
    columns: 2,
  },
);

qaSingleMenu.interact(
  (ctx) => {
    const { data } = ctx.scene.session;
    if (data?.qaId && data.question?.type === QuestionType.MultipleChoice) {
      return ctx.i18n.t('qa_confirm');
    }
    return '';
  },
  'qatConfirm',
  {
    joinLastRow: true,
    do: async (ctx) => {
      const { data } = ctx.scene.session;
      if (data?.qaId && data.question) {
        const qa = await QuestionnareAttemptModel.findById(data.qaId);
        if (qa) {
          const an = new AnswerModel({
            answer: data.selections ? data.selections.join(', ') : '-',
            user: ctx.dbuser,
            attempt: qa,
            question: data.question,
          });
          await an.save();

          if (data.selections) {
            delete data.selections;
          }
          delete data.question;
        }
      }

      await ctx.answerCbQuery();
      return true;
    },
  },
);

qaSingleMenu.interact(
  (ctx) => {
    const { data } = ctx.scene.session;
    if (
      data?.qaId &&
      data.question &&
      (data.question.type === QuestionType.Short ||
        data.question.type === QuestionType.Paragraph)
    ) {
      return ctx.i18n.t('qa_answer_btn');
    }
    return '';
  },
  'qatAnswer',
  {
    do: async (ctx) => {
      const { data } = ctx.scene.session;
      if (data?.qaId && data.question) {
        data.answerRequired = true;
        await ctx.deleteMessage();
        const msg = await ctx.reply(ctx.i18n.t('qa_answer_req'));
        data.answerReqMsg = msg.message_id;
      }

      await ctx.answerCbQuery();
      return false;
    },
  },
);

qaSingleMenu.interact(
  (ctx) => {
    const { data } = ctx.scene.session;
    if (data?.qaId && data.question && !data.question.isRequired) {
      return ctx.i18n.t('qa_skip');
    }
    return '';
  },
  'qatSkip',
  {
    do: async (ctx) => {
      const { data } = ctx.scene.session;
      if (data?.qaId && data.question && !data.question.isRequired) {
        const qa = await QuestionnareAttemptModel.findById(data.qaId);
        if (qa) {
          const an = new AnswerModel({
            answer: '-',
            user: ctx.dbuser,
            attempt: qa,
            question: data.question,
          });
          await an.save();

          delete data.question;
        }
      }

      await ctx.answerCbQuery();
      return true;
    },
  },
);

qaSingleMenu.interact((ctx) => ctx.i18n.t('close'), 'qatClose', {
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
  const { data } = ctx.scene.session;
  if (data?.answerRequired && ctx.message && 'text' in ctx.message) {
    const answer = ctx.message.text;
    if (data.qaId && data.question) {
      const qa = await QuestionnareAttemptModel.findById(data.qaId);
      if (qa) {
        const an = new AnswerModel({
          answer,
          user: ctx.dbuser,
          attempt: qa,
          question: data.question,
        });
        await an.save();

        await ctx.deleteMessage();
        await ctx.deleteMessage(data.answerReqMsg);
        delete data.answerRequired;
        delete data.question;
        delete data.answerReqMsg;

        await replyMenuToContext(qaSingleMenu, ctx, 'qamenu/');
      }
    }
  }
};

export const qaMenuMiddleware = new MenuMiddleware('qamenu/', qaSingleMenu);
