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

export function languageKeyboard(): any {
  const locales = localesFiles();
  const result: any[] = [];
  locales.forEach((locale, index) => {
    const localeCode = locale.split('.')[0];
    const localeName = load(
      readFileSync(`${__dirname}/../../../locales/${locale}`, 'utf8'),
    );

    if (
      localeName &&
      typeof localeName === 'object' &&
      (localeName as any).name
    ) {
      if (index % 2 == 0) {
        if (index === 0) {
          result.push([
            m.button.callback((localeName as any).name, localeCode),
          ]);
        } else {
          result[result.length - 1].push(
            m.button.callback((localeName as any).name, localeCode),
          );
        }
      } else {
        result[result.length - 1].push(
          m.button.callback((localeName as any).name, localeCode),
        );
        if (index < locales.length - 1) {
          result.push([]);
        }
      }
    }
  });
  return m.inlineKeyboard(result);
}
