// Dependencies
import { readdirSync, readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { Markup as m, Telegraf } from 'telegraf';
import { TelegrafContext } from '../types/telegraf';

export function setupLanguage(bot: Telegraf<TelegrafContext>) {
  bot.command('language', (ctx) => {
    ctx.reply(ctx.i18n.t('language_choose'), languageKeyboard());
  });

  bot.action(
    localesFiles().map((file) => file.split('.')[0]),
    async (ctx) => {
      await ctx.answerCbQuery();

      if ('data' in ctx.callbackQuery) {
        let user = ctx.dbuser;
        user.language = ctx.callbackQuery.data;
        user = await (user as any).save();
        const message = ctx.callbackQuery.message;
        ctx.i18n.locale(ctx.callbackQuery.data);

        await ctx.telegram.editMessageText(
          message.chat.id,
          message.message_id,
          undefined,
          ctx.i18n.t('language_selected'),
          {
            parse_mode: 'HTML',
          },
        );

        await ctx.scene.reenter();
      }
    },
  );
}

export function languageKeyboard() {
  const locales = localesFiles();
  const result = [];
  locales.forEach((locale, index) => {
    const localeCode = locale.split('.')[0];
    const localeName = safeLoad(
      readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8'),
    ).name;
    if (index % 2 == 0) {
      if (index === 0) {
        result.push([m.button.callback(localeName, localeCode)]);
      } else {
        result[result.length - 1].push(
          m.button.callback(localeName, localeCode),
        );
      }
    } else {
      result[result.length - 1].push(m.button.callback(localeName, localeCode));
      if (index < locales.length - 1) {
        result.push([]);
      }
    }
  });
  return m.inlineKeyboard(result);
}

function localesFiles() {
  return readdirSync(`${__dirname}/../../locales`);
}
