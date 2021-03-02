import { Scenes, Telegraf } from 'telegraf';
import * as botScenes from '../scenes';
import { TelegrafContext } from '../types';

export function setupStage(bot: Telegraf<TelegrafContext>): void {
  const stage = new Scenes.Stage<TelegrafContext>(Object.values(botScenes));
  bot.use(stage.middleware());
  bot.use((ctx, next) => {
    if (!ctx.session?.__scenes?.current) {
      ctx.scene.enter('menu');
      return;
    }
    next();
  });
}

module.exports = {
  setupStage,
};
