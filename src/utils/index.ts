import { Markup, Scenes } from 'telegraf';
import {
  InlineKeyboardButton,
  ReplyKeyboardMarkup,
} from 'telegraf/typings/telegram-types';
import { bot } from '../helpers/bot';
import { Button, TelegrafContext } from '../types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

export const match18 = match;

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

export const getDefaultMarkup = (
  ctx: TelegrafContext,
  buttons: Button[],
): { reply_markup: ReplyKeyboardMarkup } => {
  const rows = getKeyboardRows(buttons.map((btn) => ctx.i18n.t(btn.cmd)));
  return Markup.keyboard(rows).oneTime().resize();
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
  await next();
};

export const logCtx = async (
  ctx: TelegrafContext,
  next: () => Promise<void>,
): Promise<void> => {
  console.log(ctx);

  await next();
};

export const attachButtons = (
  scene: Scenes.BaseScene<TelegrafContext>,
  buttons: Button[],
): void => {
  buttons.map((button) => {
    if (button.cb) {
      scene.hears(match(button.cmd), button.cb);
    }
  });
};

export const newUserNotification = async (): Promise<void> => {
  try {
    await bot.telegram.sendMessage(+process.env.ADMIN!, 'New user registered');
  } catch (error) {}
};
