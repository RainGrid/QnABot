import { Button, TelegrafContext } from '../../types';
import { enterScene, getDefaultMarkup } from '../../utils';

export const buttons: Button[] = [
  { cmd: 'questionnares', cb: enterScene('questionnares') },
  { cmd: 'language', cb: enterScene('language') },
  { cmd: 'help', cb: enterScene('help') },
  { cmd: 'author', cb: enterScene('author') },
];

export const sendMainKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('menu'), getDefaultMarkup(ctx, buttons));
};
