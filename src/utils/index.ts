import { InlineKeyboardButton } from 'telegraf/typings/telegram-types';
import { TelegrafContext } from '../types';

export const getKeyboardRows = <
  T extends string | InlineKeyboardButton.CallbackButton
>(
  buttons: T[],
  cols = 2,
): T[][] => {
  const rows = [];
  for (let i = 0; i < buttons.length; i++) {
    const rowId = Math.floor(i / cols);
    if (!rows[rowId]) {
      rows.push([buttons[i]]);
    } else {
      rows[rowId].push(buttons[i]);
    }
  }
  return rows;
};

export const enterMenu = async (ctx: TelegrafContext): Promise<void> => {
  ctx.scene.enter('menu');
};

export const enterScene = (scene: string) => async (
  ctx: TelegrafContext,
): Promise<void> => {
  ctx.scene.enter(scene);
};

export const defaultSceneData = async (
  ctx: TelegrafContext,
  next: () => Promise<void>,
): Promise<void> => {
  ctx.scene.session.data ??= {};
  next();
};
