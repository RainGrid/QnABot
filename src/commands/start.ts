// Dependencies
import { Telegraf } from 'telegraf';
import { getOrCreateAttemptById } from '../scenes/questionnares/take/helpers';
import { TelegrafContext } from '../types';
import { enterMenu } from '../utils';

export function setupStart(bot: Telegraf<TelegrafContext>): void {
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
