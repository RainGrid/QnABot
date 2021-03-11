import { Scenes } from 'telegraf';
import { TelegrafContext } from '../../types';
import { match18 } from '../../utils';
import { handleLanguageSelect } from './actions';
import { localesFiles, sendKeyboard } from './helpers';

const scene = new Scenes.BaseScene<TelegrafContext>('language');

scene.enter(async (ctx: TelegrafContext) => {
  await sendKeyboard(ctx);
});

scene.action(
  localesFiles().map((file) => file.split('.')[0]),
  handleLanguageSelect,
);

scene.hears(match18('back'), async (ctx) => {
  ctx.scene.enter('menu');
});

export default scene;
