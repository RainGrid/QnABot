import { Markup } from 'telegraf';
import { TelegrafContext } from '../../../types';
import { getKeyboardRows } from '../../../utils';

export type Button = {
  cmd: string;
  cb?: (ctx: TelegrafContext) => Promise<void>;
};

export const sendKeyboard = async (
  ctx: TelegrafContext,
  buttons: Button[],
): Promise<void> => {
  const rows = getKeyboardRows(buttons.map((btn) => ctx.i18n.t(btn.cmd)));
  const markup = Markup.keyboard(rows).oneTime().resize();
  await ctx.reply(ctx.i18n.t('qnew_name'), markup);
};