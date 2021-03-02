// Dependencies
import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types';

export const bot = new Telegraf<TelegrafContext>(process.env.TOKEN);

bot.telegram.getMe().then((botInfo) => {
  const anybot = bot as any;
  anybot.options.username = botInfo.username;
});
