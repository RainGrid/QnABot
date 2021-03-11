import { Button, TelegrafContext } from '../../types';
import { enterMenu, getDefaultMarkup } from '../../utils';

export const buttons: Button[] = [
  {
    cmd: 'back',
    cb: enterMenu,
  },
];

export const sendKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('about_author'), getDefaultMarkup(ctx, buttons));
};
