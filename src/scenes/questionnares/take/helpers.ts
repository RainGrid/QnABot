import { Button, TelegrafContext } from '../../../types';
import { enterScene, getDefaultMarkup } from '../../../utils';
import { actionEnterCodeStep } from './actions';

export const buttons: Button[] = [
  {
    cmd: 'qtake_code',
    cb: actionEnterCodeStep,
  },
  {
    cmd: 'back',
    cb: enterScene('questionnares'),
  },
];

export const sendMainKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('qtake'), getDefaultMarkup(ctx, buttons));
};
