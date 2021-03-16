// Dependencies
import { isValidObjectId } from 'mongoose';
import { Telegraf } from 'telegraf';
import { QuestionnareAttemptModel, QuestionnareModel } from '../models';
import { TelegrafContext } from '../types';
import { enterMenu, enterScene } from '../utils';

export function setupHelp(bot: Telegraf<TelegrafContext>): void {
  bot.command('help', (ctx) => {
    enterScene('help')(ctx);
  });
  bot.command('start', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    if (parts.length > 1) {
      if (isValidObjectId(parts[1])) {
        const q = await QuestionnareModel.findById(parts[1]);
        if (!q || !q.isEnabled) {
          await ctx.reply(ctx.i18n.t('qtake_wrong_code'));
          return;
        }

        const exists = await QuestionnareAttemptModel.findOne({
          questionnare: q,
          user: ctx.dbuser,
        });
        if (!exists) {
          const qa = new QuestionnareAttemptModel({
            questionnare: q,
            user: ctx.dbuser,
            isFinished: false,
          });
          await qa.save();
        }

        ctx.scene.enter('questionnare_take');
        return;
      }
    } else {
      enterMenu(ctx);
      return;
    }
  });
}
