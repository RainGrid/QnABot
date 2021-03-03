import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../types';

export function setupError(bot: Telegraf<TelegrafContext>): void {
  bot.catch(async (err: unknown) => {
    if (err instanceof RangeError) {
      console.error('Restarting service...');
      process.exit(1);
    }
    console.error('TgBot error =>', err);
  });
}

module.exports = {
  setupError,
};
