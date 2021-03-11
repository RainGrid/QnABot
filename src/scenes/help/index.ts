import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { attachButtons } from '../../utils';
import { buttons, sendKeyboard } from './helpers';

const scene = new Scenes.BaseScene<TelegrafContext>('help');

scene.enter(async (ctx: TelegrafContext) => {
  await sendKeyboard(ctx);
});

attachButtons(scene, buttons);

export default scene;
