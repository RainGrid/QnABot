import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../../types';
import { buttons } from './helpers';
import { sendMainKeyboard } from './helpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('questionnare_take');

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx);
});

buttons.map((button) => {
  if (button.cb) {
    scene.hears(match(button.cmd), button.cb);
  }
});

export default scene;
