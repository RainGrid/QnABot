import { Markup } from 'telegraf';
import { TelegrafContext } from '../../types';
import { enterMenu, enterScene, getKeyboardRows } from '../../utils';
import { actionImport } from './actions';

export type Button = {
  cmd: string;
  cb?: (ctx: TelegrafContext) => Promise<void>;
};

export const buttons: Button[] = [
  {
    cmd: 'qcreate',
    cb: enterScene('questionnare_new'),
  },
  {
    cmd: 'qimport',
    cb: actionImport,
  },
  {
    cmd: 'back',
    cb: enterMenu,
  },
];

export const sendMainKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  const rows = getKeyboardRows(buttons.map((btn) => ctx.i18n.t(btn.cmd)));
  const markup = Markup.keyboard(rows).oneTime().resize();
  await ctx.reply(ctx.i18n.t('questionnares'), markup);
};
