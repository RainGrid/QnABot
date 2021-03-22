import { Button, TelegrafContext } from '../../types';
import { enterMenu, enterScene, getDefaultMarkup } from '../../utils';
import { actionImport } from './actions';

export const buttons: Button[] = [
  {
    cmd: 'qtake',
    cb: enterScene('questionnaire_take'),
  },
  {
    cmd: 'qcreate',
    cb: enterScene('questionnaire_new'),
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
  await ctx.reply(ctx.i18n.t('questionnaires'), getDefaultMarkup(ctx, buttons));
};
