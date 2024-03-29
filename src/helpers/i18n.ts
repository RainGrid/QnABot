// Dependencies
import { Telegraf } from 'telegraf';
import I18N from 'telegraf-i18n';
import { TelegrafContext } from '../types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dirtyI18N = require('telegraf-i18n');

const i18n: I18N = new dirtyI18N({
  directory: `${__dirname}/../../locales`,
  useSession: false,
  allowMissing: false,
});

export function setupI18N(bot: Telegraf<TelegrafContext>): void {
  bot.use(i18n.middleware());
  bot.use(async (ctx, next) => {
    if (ctx.dbuser) {
      ctx.i18n.locale(ctx.dbuser.language);
    }
    await next();
  });
}
