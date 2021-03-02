import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types/telegraf';

export async function checkTime(bot: Telegraf<TelegrafContext>) {
  bot.use(async (ctx, next) => {
    if (ctx.updateType === 'message') {
      if (new Date().getTime() / 1000 - ctx.message.date < 5 * 60) {
        next();
      } else {
        console.log(
          `Ignoring message from ${ctx.from.id} at ${ctx.chat.id} (${
            new Date().getTime() / 1000
          }:${ctx.message.date})`,
        );
      }
    } else {
      next();
    }
  });
}
