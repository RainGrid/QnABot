// Dependencies
import { Context, Telegraf } from 'telegraf';

export const bot = new Telegraf<Context>(process.env.TOKEN);

bot.telegram.getMe().then((botInfo) => {
  const anybot = bot as any;
  anybot.options.username = botInfo.username;
});
