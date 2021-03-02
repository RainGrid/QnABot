import { Markup } from 'telegraf';
import { TelegrafContext } from '../../types';
import { getKeyboardRows } from '../../utils';

type Button = {
  cmd: string;
  cb?: (ctx: TelegrafContext) => Promise<void>;
};

export const sendKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  const buttons: Button[] = [
    {
      cmd: ctx.i18n.t('back'),
    },
  ];

  const rows = getKeyboardRows(buttons.map((btn) => btn.cmd));
  const markup = Markup.keyboard(rows).oneTime().resize();
  await ctx.reply(ctx.i18n.t('about_author'), markup);
};
