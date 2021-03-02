import { TelegrafContext } from '../../types';

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
  ctx.scene.enter('language');
  return;
};
