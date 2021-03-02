import { readdirSync, readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { Markup } from 'telegraf';
import { TelegrafContext } from '../../types';

export const sendKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('language_select'), languageKeyboard());
};

export function localesFiles() {
  return readdirSync(`${__dirname}/../../../locales`);
}

export function languageKeyboard() {
  const locales = localesFiles();
  const result = [];
  locales.forEach((locale, index) => {
    const localeCode = locale.split('.')[0];
    const localeName = safeLoad(
      readFileSync(`${__dirname}/../../../locales/${locale}`, 'utf8'),
    ).name;
    if (index % 2 == 0) {
      if (index === 0) {
        result.push([Markup.button.callback(localeName, localeCode)]);
      } else {
        result[result.length - 1].push(
          Markup.button.callback(localeName, localeCode),
        );
      }
    } else {
      result[result.length - 1].push(
        Markup.button.callback(localeName, localeCode),
      );
      if (index < locales.length - 1) {
        result.push([]);
      }
    }
  });
  return Markup.inlineKeyboard(result);
}
