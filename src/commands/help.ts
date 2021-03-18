// Dependencies
import { Telegraf } from 'telegraf';
import { getOrCreateAttemptById } from '../scenes/questionnares/take/helpers';
import { TelegrafContext } from '../types';
import { enterMenu, enterScene } from '../utils';

export function setupHelp(bot: Telegraf<TelegrafContext>): void {
  bot.help((ctx) => {
    enterScene('help')(ctx);
  });
  bot.start(async (ctx) => {
    if (ctx.startPayload) {
      await getOrCreateAttemptById(ctx, ctx.startPayload);
      return;
    } else {
      enterMenu(ctx);
      return;
    }
  });
}
