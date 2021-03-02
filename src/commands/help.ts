// Dependencies
import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types/telegraf';

export function setupHelp(bot: Telegraf<TelegrafContext>) {
  bot.command(['help', 'start'], (ctx) => {
    ctx.replyWithHTML(ctx.i18n.t('help_message'));
  });
}
