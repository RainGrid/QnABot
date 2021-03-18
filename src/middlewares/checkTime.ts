import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types';

export function checkTime(bot: Telegraf<TelegrafContext>): void {
  bot.use(async (ctx, next) => {
    if (ctx.message) {
      if (new Date().getTime() / 1000 - ctx.message.date < 5 * 60) {
        next();
      }
    } else {
      next();
    }
  });
}
