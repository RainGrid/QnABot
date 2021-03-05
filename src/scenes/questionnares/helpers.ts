import { Markup } from 'telegraf';
import { Button, TelegrafContext } from '../../types';
import { enterMenu, enterScene, getKeyboardRows } from '../../utils';
import { actionImport } from './actions';

export const buttons: Button[] = [
  {
    cmd: 'qtake',
    cb: enterScene('questionnare_take'),
  },
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
