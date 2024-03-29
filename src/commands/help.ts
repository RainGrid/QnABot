// Dependencies
import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types';
import { enterScene } from '../utils';

export function setupHelp(bot: Telegraf<TelegrafContext>): void {
  bot.help((ctx) => {
    enterScene('help')(ctx);
  });
}
