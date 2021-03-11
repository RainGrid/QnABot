import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { attachButtons } from '../../utils';
import { buttons, sendMainKeyboard } from './helpers';

const scene = new Scenes.BaseScene<TelegrafContext>('menu');

scene.enter(async (ctx: TelegrafContext) => {
  await sendMainKeyboard(ctx);
});

attachButtons(scene, buttons);

export default scene;
