// Dependencies
import { Telegraf } from 'telegraf';
import { findUser } from '../models';
import { TelegrafContext } from '../types';

export function attachUser(bot: Telegraf<TelegrafContext>): void {
  bot.use(async (ctx, next) => {
    if (ctx.from) {
      ctx.dbuser = await findUser(ctx.from.id);
    }
    await next();
  });
}
