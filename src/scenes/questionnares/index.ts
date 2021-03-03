import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { enterMenu, enterScene } from '../../utils';
import { actionImport, actionProcessPayload } from './actions';
import { Button, sendMainKeyboard } from './helpers';
import { menuMiddleware } from './menu';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('questionnares');

const buttons: Button[] = [
  {
    cmd: 'qcreate',
    cb: enterScene('questionnare_new'),
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

scene.use(menuMiddleware);

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx, buttons);
  menuMiddleware.replyToContext(ctx);
});

buttons.map((button) => {
  if (button.cb) {
    scene.hears(match(button.cmd), button.cb);
  }
});

scene.on('text', actionProcessPayload);

export default scene;
