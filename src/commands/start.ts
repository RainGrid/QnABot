// Dependencies
import { Telegraf } from 'telegraf';
import { getOrCreateAttemptById } from '../scenes/questionnaires/take/helpers';
import { TelegrafContext } from '../types';
import { enterMenu } from '../utils';

export function setupStart(bot: Telegraf<TelegrafContext>): void {
  bot.start(async (ctx) => {
    if (ctx.startPayload) {
      const qa = await getOrCreateAttemptById(ctx, ctx.startPayload);
      if (qa) {
        ctx.session.qaId = qa._id.toString();
        await ctx.scene.enter('questionnaire_take');
      }
      return;
    } else {
      await enterMenu(ctx);
      return;
    }
  });
}
