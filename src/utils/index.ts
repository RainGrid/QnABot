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

export const enterMenu = async (ctx: TelegrafContext) => {
  ctx.scene.enter('menu');
};

export const enterScene = (scene) => async (ctx: TelegrafContext) => {
  ctx.scene.enter(scene);
};
