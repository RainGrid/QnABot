import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types/telegraf';
import { sendKeyboard } from './helpers';
const { match } = require('telegraf-i18n');

const scene = new Scenes.BaseScene<TelegrafContext>('help');

scene.enter(async (ctx: TelegrafContext) => {
  await sendKeyboard(ctx);
});

scene.hears(match('back'), async (ctx) => {
  ctx.scene.enter('menu');
});

export default scene;
