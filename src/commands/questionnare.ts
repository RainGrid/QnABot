// Dependencies
import { Telegraf } from 'telegraf';
import { Questionnare, QuestionnareModel } from '../models';
import { TelegrafContext } from '../types/telegraf';

export function setupQuestionnare(bot: Telegraf<TelegrafContext>) {
  bot.command('questionnare', async (ctx) => {
    const q = new QuestionnareModel({
      name: 'Test',
      description: 'test descr',
      isEnabled: false,
    } as Questionnare);
    await q.save();

    ctx.session = { q };
    await ctx.reply('test q is created');
  });
}
