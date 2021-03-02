import { enterScene } from '../../utils';
import { enterMenu } from '../../utils';
import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { Button, sendMainKeyboard } from './helpers';
import { actionImport, actionProcessPayload } from './actions';
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('questionnares');

const buttons: Button[] = [
  {
    cmd: 'qimport',
    cb: actionImport,
  },
  {
    cmd: 'back',
    cb: enterMenu,
  },
];

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx, buttons);
});

buttons.map((button) => {
  scene.hears(match(button.cmd), button.cb);
});

scene.on('text', actionProcessPayload);

export default scene;
