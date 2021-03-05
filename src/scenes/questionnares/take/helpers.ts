import { Markup } from 'telegraf';
import { Button, TelegrafContext } from '../../../types';
import { enterScene, getKeyboardRows } from '../../../utils';

export const buttons: Button[] = [
  {
    cmd: 'back',
    cb: enterScene('questionnares'),
  },
];

export const sendMainKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  const rows = getKeyboardRows(buttons.map((btn) => ctx.i18n.t(btn.cmd)));
  const markup = Markup.keyboard(rows).oneTime().resize();
  await ctx.reply(ctx.i18n.t('qtake'), markup);
};
