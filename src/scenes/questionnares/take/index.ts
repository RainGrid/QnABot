import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../../types';
import { actionProcessPayload } from './actions';
import { buttons, sendMainKeyboard } from './helpers';
import { takeMenuMiddleware } from './menus';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('questionnare_take');

scene.use(takeMenuMiddleware);

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx);
  takeMenuMiddleware.replyToContext(ctx);
});

buttons.map((button) => {
  if (button.cb) {
    scene.hears(match(button.cmd), button.cb);
  }
});

scene.on('text', actionProcessPayload);

export default scene;