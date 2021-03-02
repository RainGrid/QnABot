import { Message } from 'telegraf/typings/telegram-types';
import { languageKeyboard } from '../../commands/language';
import { TelegrafContext } from '../../types/telegraf';

export const actionEnterQuestionnaresScene = async (
  ctx: TelegrafContext,
): Promise<void> => {
  ctx.scene.enter('questionnares');
  return;
};

export const actionEnterHelpScene = async (
  ctx: TelegrafContext,
): Promise<void> => {
  ctx.scene.enter('help');
  return;
};

export const actionEnterAuthorScene = async (
  ctx: TelegrafContext,
): Promise<void> => {
  ctx.scene.enter('author');
  return;
};

export const actionSendLanguageKeyboard = async (
  ctx: TelegrafContext,
): Promise<void> => {
  ctx.reply(ctx.i18n.t('language_choose'), languageKeyboard());
  return;
};
