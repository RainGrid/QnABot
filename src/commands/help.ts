// Dependencies
import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types';

export function setupHelp(bot: Telegraf<TelegrafContext>): void {
  bot.command(['help', 'start'], (ctx) => {
    ctx.replyWithHTML(ctx.i18n.t('help_message'));
  });
}
