// Dependencies
import { Telegraf } from 'telegraf';
import I18N from 'telegraf-i18n';
import { TelegrafContext } from '../types';
const dirtyI18N = require('telegraf-i18n');

const i18n: I18N = new dirtyI18N({
  directory: `${__dirname}/../../locales`,
  defaultLanguage: 'en',
  sessionName: 'session',
  useSession: false,
  allowMissing: false,
});

export function setupI18N(bot: Telegraf<TelegrafContext>) {
  bot.use(i18n.middleware());
  bot.use((ctx, next) => {
    ctx.i18n.locale(ctx.dbuser.language);
    next();
  });
}
