import { Button, TelegrafContext } from '../../../types';
import { enterScene, getDefaultMarkup } from '../../../utils';

export const buttons: Button[] = [
  {
    cmd: 'back',
    cb: enterScene('questionnares'),
  },
];

export const sendKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('qnew_name'), getDefaultMarkup(ctx, buttons));
};
