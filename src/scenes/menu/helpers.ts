import { Button, TelegrafContext } from '../../types';
import { getDefaultMarkup } from '../../utils';
import {
  actionEnterAuthorScene,
  actionEnterHelpScene,
  actionEnterQuestionnaresScene,
  actionSendLanguageKeyboard,
} from './actions';

export const buttons: Button[] = [
  { cmd: 'questionnares', cb: actionEnterQuestionnaresScene },
  { cmd: 'language', cb: actionSendLanguageKeyboard },
  { cmd: 'help', cb: actionEnterHelpScene },
  { cmd: 'author', cb: actionEnterAuthorScene },
];

export const sendMainKeyboard = async (ctx: TelegrafContext): Promise<void> => {
  await ctx.reply(ctx.i18n.t('menu'), getDefaultMarkup(ctx, buttons));
};
