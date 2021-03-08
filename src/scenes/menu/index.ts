import { Scenes } from 'telegraf';
import { Button, TelegrafContext } from '../../types';
import {
  actionEnterAuthorScene,
  actionEnterHelpScene,
  actionEnterQuestionnaresScene,
  actionSendLanguageKeyboard,
} from './actions';
import { sendMainKeyboard } from './helpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('menu');

const buttons: Button[] = [
  { cmd: 'questionnares', cb: actionEnterQuestionnaresScene },
  { cmd: 'language', cb: actionSendLanguageKeyboard },
  { cmd: 'help', cb: actionEnterHelpScene },
  { cmd: 'author', cb: actionEnterAuthorScene },
];

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx, buttons);
});

buttons.map((button) => {
  if (button.cb) {
    scene.hears(match(button.cmd), button.cb);
  }
});

export default scene;
