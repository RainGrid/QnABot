// Dependencies
import { Telegraf } from 'telegraf';
import { findUser } from '../models';
import { TelegrafContext } from '../types/telegraf';

export async function attachUser(bot: Telegraf<TelegrafContext>) {
  bot.use(async (ctx, next) => {
    const dbuser = await findUser(ctx.from.id);
    ctx.dbuser = dbuser;
    next();
  });
}
