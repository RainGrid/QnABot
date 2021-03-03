import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../../types';
import { defaultSceneData, enterScene } from '../../../utils';
import { actionProcessPayload } from './actions';
import { Button, sendKeyboard } from './helpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('questionnare_new');

const buttons: Button[] = [
  {
    cmd: 'back',
    cb: enterScene('questionnares'),
  },
];

scene.use(defaultSceneData);

scene.enter(async (ctx: TelegrafContext) => {
  ctx.scene.session.data = { step: 'qname' };
  await sendKeyboard(ctx, buttons);
});

buttons.map((button) => {
  if (button.cb) {
    scene.hears(match(button.cmd), button.cb);
  }
});

scene.on('text', actionProcessPayload);

export default scene;
