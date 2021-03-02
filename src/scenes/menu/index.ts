import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import {
  actionEnterAuthorScene,
  actionEnterHelpScene,
  actionEnterQuestionnaresScene,
  actionSendLanguageKeyboard,
} from './actions';
import { Button, sendMainKeyboard } from './helpers';
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
