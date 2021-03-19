import { readdirSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { Markup as m } from 'telegraf';
import { TelegrafContext } from '../../types';

export const sendKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('language_select'), languageKeyboard());
};

export function localesFiles(): string[] {
  return readdirSync(`${__dirname}/../../../locales`);
}

export function languageKeyboard() {
  const locales = localesFiles();
  const result: any[] = [];
  locales.forEach((localeFileName, index) => {
    const localeCode = localeFileName.split('.')[0];
    const locale = load(
      readFileSync(`${__dirname}/../../../locales/${localeFileName}`, 'utf8'),
    );

    if (locale && typeof locale === 'object' && 'name' in locale) {
      const localeObj = locale as { [key: string]: string };
      if (index % 2 == 0) {
        if (index === 0) {
          result.push([m.button.callback(localeObj.name, localeCode)]);
        } else {
          result[result.length - 1].push(
            m.button.callback(localeObj.name, localeCode),
          );
        }
      } else {
        result[result.length - 1].push(
          m.button.callback(localeObj.name, localeCode),
        );
        if (index < locales.length - 1) {
          result.push([]);
        }
      }
    }
  });
  return m.inlineKeyboard(result);
}
