// Dependencies
import I18N from 'telegraf-i18n';
import { Telegraf, Context } from 'telegraf';

const i18n = new I18N({
  directory: `${__dirname}/../../locales`,
  defaultLanguage: 'en',
  sessionName: 'session',
  useSession: false,
  allowMissing: false,
});

export function setupI18N(bot: Telegraf<Context>) {
  bot.use(i18n.middleware());
  bot.use((ctx, next) => {
    const anyI18N = ctx.i18n;
    anyI18N.locale(ctx.dbuser.language);
    next();
  });
}
